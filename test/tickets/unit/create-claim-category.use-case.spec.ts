import { ConflictException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CreateClaimCategory } from '../../../src/module/tickets/application/useCases/create-claim-category.use-case';
import { ClaimCategoryService } from '../../../src/module/tickets/infrastructure/services/claim-category.service';

describe('CreateClaimCategory UseCase', () => {
  let useCase: CreateClaimCategory;
  let categoryService: Partial<ClaimCategoryService>;

  beforeEach(async () => {
    categoryService = { findByName: jest.fn(), create: jest.fn() } as any;

    const module = await Test.createTestingModule({
      providers: [
        CreateClaimCategory,
        { provide: ClaimCategoryService, useValue: categoryService },
      ],
    }).compile();

    useCase = module.get<CreateClaimCategory>(CreateClaimCategory);
  });

  afterEach(() => jest.resetAllMocks());

  it('throws ConflictException when name exists', async () => {
    (categoryService.findByName as jest.Mock).mockResolvedValue({ id: 'x' });
    await expect(
      useCase.execute({ name: 'EXISTS', description: '' }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('creates category when name not exists', async () => {
    (categoryService.findByName as jest.Mock).mockResolvedValue(undefined);
    const created = { id: 'cat-1' };
    (categoryService.create as jest.Mock).mockResolvedValue(created);

    const res = await useCase.execute({ name: 'New', description: 'd' });
    expect(categoryService.create).toHaveBeenCalled();
    expect(res).toBe(created.id);
  });
});
