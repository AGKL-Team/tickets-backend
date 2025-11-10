import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { Claim } from './claim.entity';

@Entity('claim_criticalities')
export class ClaimCriticality {
  @ObjectIdColumn()
  id!: string;

  @Column()
  level!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  claims?: Claim[];

  changeLevel(level: string) {
    this.level = level;
  }

  changeDescription(description: string) {
    this.description = description;
  }
}
