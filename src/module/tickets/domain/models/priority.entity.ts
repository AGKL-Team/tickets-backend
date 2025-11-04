import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Claim } from './claim.entity';

@Entity({ name: 'priorities' })
export class Priority {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('int')
  number!: number;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => Claim, (claim) => claim.priority)
  claims?: Claim[];

  changeNumber(number: number) {
    this.number = number;
  }

  changeDescription(description: string) {
    this.description = description;
  }

  static create(number: number, description?: string) {
    const priority = new Priority();

    priority.number = number;
    priority.description = description;

    return priority;
  }
}
