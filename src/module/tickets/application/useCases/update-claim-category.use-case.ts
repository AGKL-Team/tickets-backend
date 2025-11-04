import { ConflictException, Injectable } from '@nestjs/common';
import { ClaimCategoryService } from '../../infrastructure/services';
import { UpdateClaimCategoryDto } from '../dto/update-claim-category.dto';

@Injectable()
export class UpdateClaimCategory {
  constructor(private readonly categoryService: ClaimCategoryService) {}

  async execute(id: string, request: UpdateClaimCategoryDto) {
    // fetch existing category
    const existingCategory = await this.categoryService.findById(id);

    const normalizedName = request.name?.toUpperCase();

    // if name changes, ensure uniqueness
    if (
      normalizedName !== undefined &&
      normalizedName !== existingCategory.name
    ) {
      const alreadyExistsAnotherCategoryByNewName =
        await this.categoryService.findByName(normalizedName);

      if (alreadyExistsAnotherCategoryByNewName) {
        throw new ConflictException(
          `Ya existe una categoría con el nombre ${request.name}`,
        );
      }

      existingCategory.changeName(normalizedName);
    }

    // update description if provided
    if (request.description !== undefined) {
      existingCategory.changeDescription(request.description);
    }

    // persist updates
    const updated = await this.categoryService.update(existingCategory);

    return updated;
  }
}
