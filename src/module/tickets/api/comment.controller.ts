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
import { CreateCommentDto } from '../application/dto/create-comment.dto';
import { UpdateCommentDto } from '../application/dto/update-comment.dto';
import { CreateComment } from '../application/useCases/create-comment.use-case';
import { DeleteComment } from '../application/useCases/delete-comment.use-case';
import { UpdateComment } from '../application/useCases/update-comment.use-case';

@UseGuards(SupabaseAuthGuard)
@Controller('claims')
export class CommentController {
  constructor(
    private readonly createComment: CreateComment,
    private readonly updateComment: UpdateComment,
    private readonly deleteComment: DeleteComment,
  ) {}

  @Post(':id/comments')
  async create(
    @Param('id') claimId: string,
    @Body() body: CreateCommentDto,
    @UserFromRequest() user: User,
  ) {
    return this.createComment.execute(claimId, body.content, user.id);
  }

  @Put('comments/:id')
  async update(
    @Param('id') commentId: string,
    @Body() body: UpdateCommentDto,
    @UserFromRequest() user: User,
  ) {
    return this.updateComment.execute(commentId, body.content, user.id);
  }

  @Delete('comments/:id')
  async remove(@Param('id') commentId: string, @UserFromRequest() user: User) {
    return this.deleteComment.execute(commentId, user.id);
  }
}
