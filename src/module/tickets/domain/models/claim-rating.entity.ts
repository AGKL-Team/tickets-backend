import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { Claim } from './claim.entity';
import { RatingCategory } from './rating-category.entity';

@Entity('claim_ratings')
export class ClaimRating {
  @ObjectIdColumn()
  id!: string;

  @Column()
  score!: number;

  @Column({ nullable: true })
  date!: Date;

  @Column({ nullable: true })
  category!: RatingCategory;

  @Column({ nullable: true })
  feedback?: string;

  @Column({ nullable: true })
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
