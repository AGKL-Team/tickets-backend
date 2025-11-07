import { ForbiddenException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AssignResolver } from '../../../src/module/tickets/application/useCases/assign-resolver.use-case';
import { ClaimService } from '../../../src/module/tickets/infrastructure/services/claim.service';
import { UserAreaService } from '../../../src/module/tickets/infrastructure/services/user-area.service';
import { UserRoleService } from '../../../src/module/tickets/infrastructure/services/user-role.service';
import { fakeAreaManagerUserRole } from '../../shared/fakes/role.area-manager.fake';
import { fakeResolverUserRole } from '../../shared/fakes/role.resolver.fake';

describe('AssignResolver UseCase', () => {
  let useCase: AssignResolver;
  let claimService: Partial<ClaimService>;
  let userRoleService: Partial<UserRoleService>;
  let userAreaService: Partial<UserAreaService>;

  beforeEach(async () => {
    claimService = {
      findById: jest.fn(),
      update: jest.fn(),
    } as Partial<ClaimService>;
    userRoleService = { findByUserId: jest.fn() } as Partial<UserRoleService>;
    userAreaService = { findByUserId: jest.fn() } as Partial<UserAreaService>;

    const module = await Test.createTestingModule({
      providers: [
        AssignResolver,
        { provide: ClaimService, useValue: claimService },
        { provide: UserRoleService, useValue: userRoleService },
        { provide: UserAreaService, useValue: userAreaService },
      ],
    }).compile();

    useCase = module.get<AssignResolver>(AssignResolver);
  });

  afterEach(() => jest.resetAllMocks());

  it('assigns a resolver when operator is areaManager and assignee is resolver assigned to same area', async () => {
    const claimId = 'claim-1';
    const resolverId = 'user-resolver';
    const operatorId = 'user-op';

    const claim: any = {
      id: claimId,
      area: { id: 'area-1' },
      assignResolver: jest.fn(),
    };
    (claimService.findById as jest.Mock).mockResolvedValue(claim);

    // operator has areaManager role and resolver has resolver role
    (userRoleService.findByUserId as jest.Mock).mockImplementation(
      (uid: string) => {
        if (uid === operatorId)
          return Promise.resolve([fakeAreaManagerUserRole(uid)]);
        return Promise.resolve([fakeResolverUserRole(uid)]);
      },
    );

    (userAreaService.findByUserId as jest.Mock).mockImplementation(
      (uid: string) => {
        if (uid === operatorId)
          return Promise.resolve([{ area: { id: 'area-1' } }]);
        return Promise.resolve([{ area: { id: 'area-1' } }]);
      },
    );

    const updated = { ...claim, updated: true };
    (claimService.update as jest.Mock).mockResolvedValue(updated);

    const res = await useCase.execute(claimId, resolverId, operatorId);

    expect(claim.assignResolver).toHaveBeenCalledWith(resolverId, operatorId);
    expect(claimService.update).toHaveBeenCalledWith(claim);
    expect(res).toBe(updated);
  });

  it('throws when operator lacks permissions', async () => {
    const claimId = 'claim-2';
    const resolverId = 'r';
    const operatorId = 'u';

    (userRoleService.findByUserId as jest.Mock).mockResolvedValue([]);

    await expect(
      useCase.execute(claimId, resolverId, operatorId),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
