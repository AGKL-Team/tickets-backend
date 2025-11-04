import { ConflictException, Injectable } from '@nestjs/common';
import {
  ClaimCategoryService,
  ClaimService,
} from '../../infrastructure/services';

@Injectable()
export class DeleteClaimCategory {
  constructor(
    private readonly categoryService: ClaimCategoryService,
    private readonly claimService: ClaimService,
  ) {}

  async execute(id: string) {
    // ensure no claims are associated to this category
    const hasAssociated = await this.categoryService.hasClaimsAssociated(id);
    if (hasAssociated) {
      throw new ConflictException('La categoría tiene reclamos asociados');
    }

    await this.categoryService.delete(id);
    return { deleted: true };
  }
}
