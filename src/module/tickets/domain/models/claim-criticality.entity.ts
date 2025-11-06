import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Claim } from './claim.entity';

@Entity({ name: 'claim_criticalities' })
export class ClaimCriticality {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  level!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @OneToMany(() => Claim, (c) => c.criticality)
  claims?: Claim[];

  changeLevel(level: string) {
    this.level = level;
  }

  changeDescription(description: string) {
    this.description = description;
  }
}
