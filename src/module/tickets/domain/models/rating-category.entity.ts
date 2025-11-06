import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ClaimRating } from './claim-rating.entity';

@Entity({ name: 'rating_categories' })
export class RatingCategory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @OneToMany(() => ClaimRating, (r) => r.category)
  ratings?: ClaimRating[];

  changeName(name: string) {
    this.name = name;
  }

  changeDescription(description: string) {
    this.description = description;
  }
}
