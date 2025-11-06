import { ForbiddenException, Injectable } from '@nestjs/common';
import {
  ClaimRatingService,
  UserRoleService,
} from '../../infrastructure/services';

@Injectable()
export class DeleteRating {
  constructor(
    private readonly ratingService: ClaimRatingService,
    private readonly userRoleService: UserRoleService,
  ) {}

  async execute(ratingId: string, userId: string) {
    await this.ratingService.findById(ratingId);

    const roles = await this.userRoleService.findByUserId(userId);
    if (!roles.some((r) => r.isAdmin()))
      throw new ForbiddenException(
        'Solo un administrador puede eliminar una calificación',
      );

    await this.ratingService.delete(ratingId);
  }
}
