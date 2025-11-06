import { ForbiddenException, Injectable } from '@nestjs/common';
import {
  ClaimCommentService,
  UserRoleService,
} from '../../infrastructure/services';

@Injectable()
export class DeleteComment {
  constructor(
    private readonly commentService: ClaimCommentService,
    private readonly userRoleService: UserRoleService,
  ) {}

  async execute(commentId: string, userId: string) {
    const comment = await this.commentService.findById(commentId);

    if (comment.authorId !== userId) {
      const roles = await this.userRoleService.findByUserId(userId);
      if (!roles.some((r) => r.isAdmin()))
        throw new ForbiddenException(
          'No tiene permisos para eliminar este comentario',
        );
    }

    await this.commentService.delete(commentId);
  }
}
