import { ConflictException, Injectable } from '@nestjs/common';
import { ClaimRating } from '../../domain/models/claim-rating.entity';
import {
  ClaimRatingService,
  ClaimService,
  RatingCategoryService,
} from '../../infrastructure/services';

@Injectable()
export class CreateRating {
  constructor(
    private readonly ratingService: ClaimRatingService,
    private readonly claimService: ClaimService,
    private readonly categoryService: RatingCategoryService,
  ) {}

  async execute(
    claimId: string,
    score: number,
    categoryId: string,
    feedback?: string,
  ) {
    const claim = await this.claimService.findById(claimId, '');

    // only one rating per claim for now
    const existing = await this.ratingService.findByClaimId(claimId);
    if (existing)
      throw new ConflictException('El reclamo ya tiene una calificación');

    const category = await this.categoryService.findById(categoryId);
    const rating = ClaimRating.create(score, category, feedback, claim);
    return this.ratingService.save(rating);
  }
}
