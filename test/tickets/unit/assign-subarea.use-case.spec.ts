import { ForbiddenException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AssignSubArea } from '../../../src/module/tickets/application/useCases/assign-subarea.use-case';
import { ClaimService } from '../../../src/module/tickets/infrastructure/services/claim.service';
import { SubAreaService } from '../../../src/module/tickets/infrastructure/services/sub-area.service';
import { UserAreaService } from '../../../src/module/tickets/infrastructure/services/user-area.service';
import { UserRoleService } from '../../../src/module/tickets/infrastructure/services/user-role.service';
import { fakeAreaManagerUserRole } from '../../shared/fakes/role.area-manager.fake';

describe('AssignSubArea UseCase', () => {
  let useCase: AssignSubArea;
  let claimService: Partial<ClaimService>;
  let subAreaService: Partial<SubAreaService>;
  let userRoleService: Partial<UserRoleService>;
  let userAreaService: Partial<UserAreaService>;

  beforeEach(async () => {
    claimService = {
      findById: jest.fn(),
      update: jest.fn(),
    } as Partial<ClaimService>;
    subAreaService = { findById: jest.fn() } as Partial<SubAreaService>;
    userRoleService = { findByUserId: jest.fn() } as Partial<UserRoleService>;
    userAreaService = { findByUserId: jest.fn() } as Partial<UserAreaService>;

    const module = await Test.createTestingModule({
      providers: [
        AssignSubArea,
        { provide: ClaimService, useValue: claimService },
        { provide: SubAreaService, useValue: subAreaService },
        { provide: UserRoleService, useValue: userRoleService },
        { provide: UserAreaService, useValue: userAreaService },
      ],
    }).compile();

    useCase = module.get<AssignSubArea>(AssignSubArea);
  });

  afterEach(() => jest.resetAllMocks());

  it('changes sub-area when operator is areaManager assigned to both areas', async () => {
    const claimId = 'c1';
    const subAreaId = 'sa1';
    const operatorId = 'op1';

    const claim: any = {
      id: claimId,
      area: { id: 'area-1' },
      changeSubArea: jest.fn(),
    };
    const subArea: any = { id: subAreaId, area: { id: 'area-1' } };

    (claimService.findById as jest.Mock).mockResolvedValue(claim);
    (subAreaService.findById as jest.Mock).mockResolvedValue(subArea);

    (userRoleService.findByUserId as jest.Mock).mockResolvedValue([
      fakeAreaManagerUserRole(operatorId),
    ]);
    (userAreaService.findByUserId as jest.Mock).mockResolvedValue([
      { areaId: 'area-1' },
    ]);

    const updated = { ...claim, updated: true };
    (claimService.update as jest.Mock).mockResolvedValue(updated);

    const res = await useCase.execute(claimId, subAreaId, operatorId);

    expect(claim.changeSubArea).toHaveBeenCalledWith(subArea, operatorId);
    expect(claimService.update).toHaveBeenCalledWith(claim);
    expect(res).toBe(updated);
  });

  it('throws when operator lacks permissions', async () => {
    (userRoleService.findByUserId as jest.Mock).mockResolvedValue([]);
    await expect(useCase.execute('c', 's', 'u')).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });
});
