import { ConflictException, Injectable } from '@nestjs/common';
import { ClaimCategory } from '../../domain/models';
import { ClaimCategoryService } from '../../infrastructure/services';
import { CreateClaimCategoryDto } from '../dto/create-claim-category.dto';

@Injectable()
export class CreateClaimCategory {
  constructor(private readonly categoryService: ClaimCategoryService) {}

  async execute(request: CreateClaimCategoryDto) {
    const exists = await this.categoryService.findByName(request.name);
    if (exists) {
      throw new ConflictException(
        `Ya existe una categoría con el nombre ${request.name}`,
      );
    }

    const category = ClaimCategory.create(
      request.name.toUpperCase(),
      request.description,
    );

    const created = await this.categoryService.create(category);

    return created.id;
  }
}
