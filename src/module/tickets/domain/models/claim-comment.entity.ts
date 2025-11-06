import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Claim } from './claim.entity';

@Entity({ name: 'claim_comments' })
export class ClaimComment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  content!: string;

  @Column()
  authorId!: string;

  @CreateDateColumn()
  date!: Date;

  @ManyToOne(() => Claim, (c) => c.comments)
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
