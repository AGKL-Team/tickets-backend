/**
 * Integration-style test (in-memory fakes) for a common happy path:
 * - Client creates a claim
 * - AreaManager assigns a Resolver to the claim
 * - Resolver starts and resolves the claim (domain methods invoked)
 * - Client rates the claim
 *
 * The test uses light in-memory implementations for services (ClaimService,
 * RatingService) so we exercise several use-cases together and verify
 * ClaimHistory entries and rating persistence.
 */

import { AssignResolver } from '../../../src/module/tickets/application/useCases/assign-resolver.use-case';
import { CreateClaim } from '../../../src/module/tickets/application/useCases/create-claim.use-case';
import { CreateRating } from '../../../src/module/tickets/application/useCases/create-rating.use-case';
import { ClaimCategory } from '../../../src/module/tickets/domain/models/claim-category.entity';
import { ClaimHistory } from '../../../src/module/tickets/domain/models/claim-history.entity';
import { Claim } from '../../../src/module/tickets/domain/models/claim.entity';
import { Priority } from '../../../src/module/tickets/domain/models/priority.entity';
import {
  areaManagerUserRole,
  resolverUserRole,
} from '../../shared/helpers/role-fakes';

describe('Create -> Assign -> Start -> Resolve -> Rate flow (integration)', () => {
  it('executes full happy path using in-memory services', async () => {
    // In-memory stores
    const claims = new Map<string, Claim>();
    const ratings = new Map<string, any>();

    // Fake ClaimService minimal implementation
    const claimService: any = {
      save: (claim: Claim) => {
        // assign an id and persist
        const id = `c-${claims.size + 1}`;
        claim.id = id;
        claims.set(id, claim);
        return Promise.resolve(id);
      },
      findById: (id: string) => Promise.resolve(claims.get(id)),
      update: (claim: Claim) => {
        claims.set(claim.id, claim);
        return Promise.resolve(claim);
      },
    };

    // Other fake services used by CreateClaim
    const priorityService: any = {
      findById: () => Promise.resolve(Priority.create(1, 'alta')),
    };
    const categoryService: any = {
      findById: () => Promise.resolve(ClaimCategory.create('general', 'desc')),
    };
    const areaService: any = {
      findById: () => Promise.resolve({ id: 'area-1', name: 'Area 1' }),
    };
    const projectService: any = { findById: () => Promise.resolve(undefined) };
    const criticalityService: any = {
      findById: () => Promise.resolve(undefined),
    };

    const createClaim = new CreateClaim(
      claimService,
      priorityService,
      categoryService,
      areaService,
      projectService,
      criticalityService,
    );

    const clientId = 'client-1';
    const request: any = {
      issue: 'Integración - asunto',
      description: 'Descripción de prueba',
      date: new Date().toISOString(),
      priorityId: 'p1',
      categoryId: 'c1',
      areaId: 'area-1',
    };

    const created = await createClaim.execute(request, clientId);
    const claimId = typeof created === 'string' ? created : (created as any).id;
    expect(typeof claimId).toBe('string');

    // Assign resolver
    const assignResolver = new AssignResolver(
      claimService,
      /* userRoleService */ {
        findByUserId: (uid: string) =>
          Promise.resolve(
            uid === 'op-1'
              ? [areaManagerUserRole(uid)]
              : [resolverUserRole(uid)],
          ),
      } as any,
      /* userAreaService */ {
        findByUserId: (uid: string) => {
          void uid;
          return Promise.resolve([{ area: { id: 'area-1' } }]);
        },
      } as any,
    );

    const resolverId = 'resolver-1';
    const operatorId = 'op-1';

    const afterAssign = await assignResolver.execute(
      claimId,
      resolverId,
      operatorId,
    );
    expect(afterAssign).toBeDefined();
    const stored = claims.get(claimId) as Claim;
    expect(stored.claimResolverId).toBe(resolverId);

    // Simulate resolver starting and resolving via domain methods
    stored.start(undefined, resolverId);
    await claimService.update(stored);

    stored.resolve(resolverId, resolverId);
    await claimService.update(stored);

    // Rate the claim
    const ratingService: any = {
      findByClaimId: (_cid: string) => {
        void _cid;
        return Promise.resolve(null);
      },
      save: (r: any) => {
        const id = `r-${ratings.size + 1}`;
        r.id = id;
        ratings.set(id, r);
        return Promise.resolve(r);
      },
    };
    const ratingCategoryService: any = {
      findById: (id: string) => Promise.resolve({ id, name: 'satisfaction' }),
    };

    const createRating = new CreateRating(
      ratingService,
      claimService,
      ratingCategoryService,
    );
    const savedRating = await createRating.execute(
      claimId,
      5,
      'rc1',
      'Excelente',
    );
    expect(savedRating).toBeDefined();

    // Final assertions: history must contain entries for assignment, start and resolve
    const final = claims.get(claimId) as Claim;
    expect(final.history).toBeDefined();
    const history = final.history ?? [];
    const descriptions = history.map((h: ClaimHistory) => h.description ?? '');
    expect(
      descriptions.some((d: string) => d.includes('Asignación de responsable')),
    ).toBe(true);
    expect(
      descriptions.some((d: string) => d.includes('Inicio de gestión')),
    ).toBe(true);
    expect(
      descriptions.some((d: string) => d.includes('Reclamo resuelto')),
    ).toBe(true);
  });
});
