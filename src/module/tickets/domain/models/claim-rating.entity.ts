import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Claim } from './claim.entity';
import { RatingCategory } from './rating-category.entity';

@Entity({ name: 'claim_ratings' })
export class ClaimRating {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('int')
  score!: number;

  @CreateDateColumn()
  date!: Date;

  @ManyToOne(() => RatingCategory, (c) => c.ratings, { eager: true })
  category!: RatingCategory;

  @Column({ type: 'text', nullable: true })
  feedback?: string;

  @OneToOne(() => Claim, (claim) => claim.rating)
  @JoinColumn()
  claim!: Claim;

  static create(
    score: number,
    category: RatingCategory,
    feedback: string | undefined,
    claim: Claim,
  ) {
    const r = new ClaimRating();
    r.score = score;
    r.category = category;
    r.feedback = feedback;
    r.date = new Date();
    r.claim = claim;
    return r;
  }
}
