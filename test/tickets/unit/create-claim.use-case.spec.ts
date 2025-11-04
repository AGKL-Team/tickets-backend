import { Test } from '@nestjs/testing';
import { CreateClaim } from '../../../src/module/tickets/application/useCases/create-claim.use-case';
import { AreaService } from '../../../src/module/tickets/infrastructure/services';
import { ClaimCategoryService } from '../../../src/module/tickets/infrastructure/services/claim-category.service';
import { ClaimService } from '../../../src/module/tickets/infrastructure/services/claim.service';
import { PriorityService } from '../../../src/module/tickets/infrastructure/services/priority.service';

describe('CreateClaim UseCase', () => {
  let useCase: CreateClaim;
  let claimService: Partial<ClaimService>;
  let priorityService: Partial<PriorityService>;
  let categoryService: Partial<ClaimCategoryService>;
  let areaService: Partial<AreaService>;

  beforeEach(async () => {
    claimService = { save: jest.fn() } as any;
    priorityService = { findById: jest.fn() } as any;
    categoryService = { findById: jest.fn() } as any;
    areaService = { findById: jest.fn() } as any;

    const module = await Test.createTestingModule({
      providers: [
        CreateClaim,
        { provide: ClaimService, useValue: claimService },
        { provide: PriorityService, useValue: priorityService },
        { provide: ClaimCategoryService, useValue: categoryService },
        { provide: AreaService, useValue: areaService },
      ],
    }).compile();

    useCase = module.get<CreateClaim>(CreateClaim);
  });

  afterEach(() => jest.resetAllMocks());

  it('creates a claim and returns saved id', async () => {
    const dto: any = {
      issue: 'x',
      description: 'd',
      date: '2025-11-03',
      priorityId: 'p1',
      categoryId: 'c1',
      areaId: 'a1',
    };
    const clientId = 'user-1';

    const priority = { id: 'p1' } as any;
    const category = { id: 'c1' } as any;
    const area = { id: 'a1' } as any;

    (priorityService.findById as jest.Mock).mockResolvedValue(priority);
    (categoryService.findById as jest.Mock).mockResolvedValue(category);
    (areaService.findById as jest.Mock).mockResolvedValue(area);

    const saved = 'saved-id';
    (claimService.save as jest.Mock).mockResolvedValue(saved);

    const res = await useCase.execute(dto, clientId);

    expect(priorityService.findById).toHaveBeenCalledWith(dto.priorityId);
    expect(categoryService.findById).toHaveBeenCalledWith(dto.categoryId);
    expect(areaService.findById).toHaveBeenCalledWith(dto.areaId);
    expect(claimService.save).toHaveBeenCalled();
    expect(res).toBe(saved);
  });
});
