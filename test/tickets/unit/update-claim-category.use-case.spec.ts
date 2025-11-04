import { ConflictException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { UpdateClaimCategory } from '../../../src/module/tickets/application/useCases/update-claim-category.use-case';
import { ClaimCategoryService } from '../../../src/module/tickets/infrastructure/services/claim-category.service';

describe('UpdateClaimCategory UseCase', () => {
  let useCase: UpdateClaimCategory;
  let categoryService: Partial<ClaimCategoryService>;

  beforeEach(async () => {
    categoryService = {
      findById: jest.fn(),
      findByName: jest.fn(),
      update: jest.fn(),
    } as any;

    const module = await Test.createTestingModule({
      providers: [
        UpdateClaimCategory,
        { provide: ClaimCategoryService, useValue: categoryService },
      ],
    }).compile();

    useCase = module.get<UpdateClaimCategory>(UpdateClaimCategory);
  });

  afterEach(() => jest.resetAllMocks());

  it('throws ConflictException when new name collides', async () => {
    const existing = {
      id: '1',
      name: 'OLD',
      changeName: jest.fn(),
      changeDescription: jest.fn(),
    } as any;
    (categoryService.findById as jest.Mock).mockResolvedValue(existing);
    (categoryService.findByName as jest.Mock).mockResolvedValue({
      id: 'other',
    });

    await expect(useCase.execute('1', { name: 'NEW' })).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it('updates when valid', async () => {
    const existing = {
      id: '1',
      name: 'OLD',
      changeName: jest.fn(),
      changeDescription: jest.fn(),
    } as any;
    (categoryService.findById as jest.Mock).mockResolvedValue(existing);
    (categoryService.findByName as jest.Mock).mockResolvedValue(undefined);
    const updated = { ...existing, updated: true };
    (categoryService.update as jest.Mock).mockResolvedValue(updated);

    const res = await useCase.execute('1', { name: 'NEW', description: 'd' });
    expect(existing.changeName).toHaveBeenCalledWith('NEW');
    expect(existing.changeDescription).toHaveBeenCalledWith('d');
    expect(categoryService.update).toHaveBeenCalledWith(existing);
    expect(res).toBe(updated);
  });
});
