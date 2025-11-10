import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { ClaimRating } from './claim-rating.entity';

@Entity('rating_categories')
export class RatingCategory {
  @ObjectIdColumn()
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  ratings?: ClaimRating[];

  changeName(name: string) {
    this.name = name;
  }

  changeDescription(description: string) {
    this.description = description;
  }
}
