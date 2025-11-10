import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { Claim } from './claim.entity';

@Entity('priorities')
export class Priority {
  @ObjectIdColumn()
  id!: string;

  @Column()
  number!: number;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
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
