import { ForbiddenException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TransferArea } from '../../../src/module/tickets/application/useCases/transfer-area.use-case';
import { AreaService } from '../../../src/module/tickets/infrastructure/services/area.service';
import { ClaimService } from '../../../src/module/tickets/infrastructure/services/claim.service';
import { UserAreaService } from '../../../src/module/tickets/infrastructure/services/user-area.service';
import { UserRoleService } from '../../../src/module/tickets/infrastructure/services/user-role.service';
import { fakeAreaManagerUserRole } from '../../shared/fakes/role.area-manager.fake';

describe('TransferArea UseCase', () => {
  let useCase: TransferArea;
  let claimService: Partial<ClaimService>;
  let areaService: Partial<AreaService>;
  let userRoleService: Partial<UserRoleService>;
  let userAreaService: Partial<UserAreaService>;

  beforeEach(async () => {
    claimService = {
      findById: jest.fn(),
      update: jest.fn(),
    } as Partial<ClaimService>;
    areaService = { findById: jest.fn() } as Partial<AreaService>;
    userRoleService = { findByUserId: jest.fn() } as Partial<UserRoleService>;
    userAreaService = { findByUserId: jest.fn() } as Partial<UserAreaService>;

    const module = await Test.createTestingModule({
      providers: [
        TransferArea,
        { provide: ClaimService, useValue: claimService },
        { provide: AreaService, useValue: areaService },
        { provide: UserRoleService, useValue: userRoleService },
        { provide: UserAreaService, useValue: userAreaService },
      ],
    }).compile();

    useCase = module.get<TransferArea>(TransferArea);
  });

  afterEach(() => jest.resetAllMocks());

  it('transfers area when operator is areaManager assigned to source and destination', async () => {
    const claimId = 'c1';
    const areaId = 'area-2';
    const operatorId = 'op1';

    const claim: any = {
      id: claimId,
      area: { id: 'area-1' },
      changeArea: jest.fn(),
    };
    const area: any = { id: areaId };

    (claimService.findById as jest.Mock).mockResolvedValue(claim);
    (areaService.findById as jest.Mock).mockResolvedValue(area);

    (userRoleService.findByUserId as jest.Mock).mockResolvedValue([
      fakeAreaManagerUserRole(operatorId),
    ]);
    (userAreaService.findByUserId as jest.Mock).mockResolvedValue([
      { areaId: 'area-1' },
      { areaId: 'area-2' },
    ]);

    const updated = { ...claim, updated: true };
    (claimService.update as jest.Mock).mockResolvedValue(updated);

    const res = await useCase.execute(claimId, areaId, operatorId);

    expect(claim.changeArea).toHaveBeenCalledWith(area, operatorId);
    expect(claimService.update).toHaveBeenCalledWith(claim);
    expect(res).toBe(updated);
  });

  it('throws when operator not assigned to destination area', async () => {
    (userRoleService.findByUserId as jest.Mock).mockResolvedValue([
      fakeAreaManagerUserRole('op'),
    ]);
    (userAreaService.findByUserId as jest.Mock).mockResolvedValue([
      { area: { id: 'area-1' } },
    ]);
    // mock area and claim lookups used by the use-case
    (areaService.findById as jest.Mock).mockResolvedValue({ id: 'area-2' });
    (claimService.findById as jest.Mock).mockResolvedValue({
      id: 'c',
      area: { id: 'area-1' },
    });

    await expect(useCase.execute('c', 'area-2', 'op')).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });
});
