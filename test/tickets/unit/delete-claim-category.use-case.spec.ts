import { ConflictException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DeleteClaimCategory } from '../../../src/module/tickets/application/useCases/delete-claim-category.use-case';
import { ClaimCategoryService } from '../../../src/module/tickets/infrastructure/services/claim-category.service';
import { ClaimService } from '../../../src/module/tickets/infrastructure/services/claim.service';

describe('DeleteClaimCategory UseCase', () => {
  let useCase: DeleteClaimCategory;
  let categoryService: Partial<ClaimCategoryService>;
  let claimService: Partial<ClaimService>;

  beforeEach(async () => {
    categoryService = {
      hasClaimsAssociated: jest.fn(),
      delete: jest.fn(),
    } as any;
    claimService = {} as any;

    const module = await Test.createTestingModule({
      providers: [
        DeleteClaimCategory,
        { provide: ClaimCategoryService, useValue: categoryService },
        { provide: ClaimService, useValue: claimService },
      ],
    }).compile();

    useCase = module.get<DeleteClaimCategory>(DeleteClaimCategory);
  });

  afterEach(() => jest.resetAllMocks());

  it('throws when category has associated claims', async () => {
    (categoryService.hasClaimsAssociated as jest.Mock).mockResolvedValue(true);
    await expect(useCase.execute('id')).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it('deletes when no associations', async () => {
    (categoryService.hasClaimsAssociated as jest.Mock).mockResolvedValue(false);
    (categoryService.delete as jest.Mock).mockResolvedValue(undefined);

    const res = await useCase.execute('id');
    expect(categoryService.delete).toHaveBeenCalledWith('id');
    expect(res).toEqual({ deleted: true });
  });
});
