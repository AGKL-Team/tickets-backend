import { ForbiddenException, Injectable } from '@nestjs/common';
import {
  ClaimRatingService,
  UserRoleService,
} from '../../infrastructure/services';

@Injectable()
export class UpdateRating {
  constructor(
    private readonly ratingService: ClaimRatingService,
    private readonly userRoleService: UserRoleService,
  ) {}

  async execute(
    ratingId: string,
    score: number,
    userId: string,
    feedback?: string,
  ) {
    const rating = await this.ratingService.findById(ratingId);

    const roles = await this.userRoleService.findByUserId(userId);
    if (!roles.some((r) => r.isAdmin()))
      throw new ForbiddenException(
        'Solo un administrador puede modificar una calificación',
      );

    rating.score = score;
    rating.feedback = feedback;
    return this.ratingService.update(rating);
  }
}
