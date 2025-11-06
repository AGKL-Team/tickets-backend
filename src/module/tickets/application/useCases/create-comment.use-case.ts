import { Injectable } from '@nestjs/common';
import { ClaimComment } from '../../domain/models/claim-comment.entity';
import {
  ClaimCommentService,
  ClaimService,
} from '../../infrastructure/services';

@Injectable()
export class CreateComment {
  constructor(
    private readonly commentService: ClaimCommentService,
    private readonly claimService: ClaimService,
  ) {}

  async execute(claimId: string, content: string, authorId: string) {
    const claim = await this.claimService.findById(claimId, authorId);
    const comment = ClaimComment.create(content, authorId, claim);
    return this.commentService.save(comment);
  }
}
