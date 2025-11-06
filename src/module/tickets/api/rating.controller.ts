import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { User } from '@supabase/supabase-js';
import { UserFromRequest } from '../../core/auth/infrastructure/decorators/user.decorator';
import { SupabaseAuthGuard } from '../../core/auth/infrastructure/guard/supabase-auth.guard';
import { CreateRatingDto } from '../application/dto/create-rating.dto';
import { UpdateRatingDto } from '../application/dto/update-rating.dto';
import { CreateRating } from '../application/useCases/create-rating.use-case';
import { DeleteRating } from '../application/useCases/delete-rating.use-case';
import { UpdateRating } from '../application/useCases/update-rating.use-case';

@UseGuards(SupabaseAuthGuard)
@Controller('claims')
export class RatingController {
  constructor(
    private readonly createRating: CreateRating,
    private readonly updateRating: UpdateRating,
    private readonly deleteRating: DeleteRating,
  ) {}

  @Post(':id/rating')
  async create(@Param('id') claimId: string, @Body() body: CreateRatingDto) {
    return this.createRating.execute(
      claimId,
      body.score,
      body.categoryId,
      body.feedback,
    );
  }

  @Put('ratings/:id')
  async update(
    @Param('id') ratingId: string,
    @Body() body: UpdateRatingDto,
    @UserFromRequest() user: User,
  ) {
    return this.updateRating.execute(
      ratingId,
      body.score,
      body.feedback,
      user.id!,
    );
  }

  @Delete('ratings/:id')
  async remove(@Param('id') ratingId: string, @UserFromRequest() user: User) {
    return this.deleteRating.execute(ratingId, user.id);
  }
}
