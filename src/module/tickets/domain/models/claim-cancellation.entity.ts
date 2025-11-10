import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { Claim } from './claim.entity';

@Entity('claim_cancellations')
export class ClaimCancellation {
  @ObjectIdColumn()
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  claim?: Claim;

  changeName(name: string) {
    this.name = name;
  }

  changeDescription(description: string) {
    this.description = description;
  }
}
