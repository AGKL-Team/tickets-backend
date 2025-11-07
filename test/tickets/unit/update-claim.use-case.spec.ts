import { BadRequestException, ConflictException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { UpdateClaim } from '../../../src/module/tickets/application/useCases/update-claim.use-case';
import { AreaService } from '../../../src/module/tickets/infrastructure/services';
import { ClaimCategoryService } from '../../../src/module/tickets/infrastructure/services/claim-category.service';
import { ClaimService } from '../../../src/module/tickets/infrastructure/services/claim.service';
import { PriorityService } from '../../../src/module/tickets/infrastructure/services/priority.service';
import { UserRoleService } from '../../../src/module/tickets/infrastructure/services/user-role.service';
import { fakeAdminUserRole } from '../../shared/fakes/role.admin.fake';

describe('UpdateClaim UseCase', () => {
  let useCase: UpdateClaim;
  let claimService: Partial<ClaimService>;
  let priorityService: Partial<PriorityService>;
  let categoryService: Partial<ClaimCategoryService>;
  let areaService: Partial<AreaService>;

  beforeEach(async () => {
    claimService = {
      findById: jest.fn(),
      update: jest.fn(),
    } as Partial<ClaimService>;

    priorityService = {
      findById: jest.fn(),
    } as Partial<PriorityService>;

    categoryService = {
      findById: jest.fn(),
    } as Partial<ClaimCategoryService>;

    areaService = { findById: jest.fn() };
    const userRoleService: Partial<UserRoleService> = {
      findByUserId: jest
        .fn()
        .mockImplementation((uid: string) =>
          Promise.resolve([fakeAdminUserRole(uid)]),
        ),
    };

    const module = await Test.createTestingModule({
      providers: [
        UpdateClaim,
        { provide: ClaimService, useValue: claimService },
        { provide: PriorityService, useValue: priorityService },
        { provide: ClaimCategoryService, useValue: categoryService },
        { provide: AreaService, useValue: areaService },
        { provide: UserRoleService, useValue: userRoleService },
      ],
    }).compile();

    useCase = module.get<UpdateClaim>(UpdateClaim);
  });

  afterEach(() => jest.resetAllMocks());

  it('updates fields when claim is pending', async () => {
    const id = 'claim-1';
    const userId = 'user-1';

    // Minimal existing claim object with the methods used by the use case
    const existing: any = {
      id,
      clientId: userId,
      isPending: () => true,
      isInProgress: () => true,
      changeIssue: jest.fn(),
      changeDescription: jest.fn(),
      changeDate: jest.fn(),
      changePriority: jest.fn(),
      changeCategory: jest.fn(),
      changeArea: jest.fn(),
    };

    (claimService.findById as jest.Mock).mockResolvedValue(existing);

    const priority = { id: 'p1' } as any;
    const category = { id: 'c1' } as any;
    const area = { id: 'a1' } as any;

    (priorityService.findById as jest.Mock).mockResolvedValue(priority);
    (categoryService.findById as jest.Mock).mockResolvedValue(category);
    (areaService.findById as jest.Mock).mockResolvedValue(area);

    const request: any = {
      issue: 'New issue',
      description: 'New description',
      date: '2025-11-03',
      priorityId: 'p1',
      categoryId: 'c1',
      areaId: 'a1',
    };

    const updated = { ...existing, updated: true };
    (claimService.update as jest.Mock).mockResolvedValue(updated);

    const res = await useCase.execute(id, request, userId);

    // ensure change methods were called when provided in request
    expect(existing.changeIssue).toHaveBeenCalledWith(request.issue);
    expect(existing.changeDescription).toHaveBeenCalledWith(
      request.description,
    );
    expect(existing.changeDate).toHaveBeenCalled();
    expect(priorityService.findById).toHaveBeenCalledWith(request.priorityId);
    expect(categoryService.findById).toHaveBeenCalledWith(request.categoryId);
    expect(areaService.findById).toHaveBeenCalledWith(request.areaId);

    expect(claimService.update).toHaveBeenCalledWith(existing);
    expect(res).toBe(updated);
  });

  it('throws ConflictException when claim is not pending', async () => {
    const id = 'claim-2';
    const userId = 'user-2';

    const existing: any = {
      id,
      clientId: userId,
      isPending: () => false,
      isInProgress: () => false,
    };

    (claimService.findById as jest.Mock).mockResolvedValue(existing);

    const request: any = { issue: 'x' };

    await expect(useCase.execute(id, request, userId)).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(claimService.update).not.toHaveBeenCalled();
  });

  it('throws BadRequestException when trying to update projectId', async () => {
    const id = 'claim-3';
    const userId = 'user-3';

    const existing: any = {
      id,
      clientId: userId,
      isPending: () => true,
      isInProgress: () => true,
      changeIssue: jest.fn(),
      changeDescription: jest.fn(),
      changeDate: jest.fn(),
      changePriority: jest.fn(),
      changeCategory: jest.fn(),
      changeArea: jest.fn(),
    };

    (claimService.findById as jest.Mock).mockResolvedValue(existing);

    const request: any = { projectId: 'proj-1' };

    await expect(useCase.execute(id, request, userId)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
