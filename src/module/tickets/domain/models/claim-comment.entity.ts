import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { Claim } from './claim.entity';

@Entity('claim_comments')
export class ClaimComment {
  @ObjectIdColumn()
  id!: string;

  @Column()
  content!: string;

  @Column()
  authorId!: string;

  @Column({ nullable: true })
  date!: Date;

  @Column({ nullable: true })
  claim!: Claim;

  static create(content: string, authorId: string, claim: Claim) {
    const comment = new ClaimComment();
    comment.content = content;
    comment.authorId = authorId;
    comment.date = new Date();
    comment.claim = claim;
    return comment;
  }
}
