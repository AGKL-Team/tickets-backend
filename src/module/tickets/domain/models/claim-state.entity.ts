import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { Claim } from './claim.entity';

@Entity('claim_states')
export class ClaimState {
  @ObjectIdColumn()
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  claims?: Claim[];

  isPending(): boolean {
    return this.name?.toLowerCase() === 'pending';
  }

  isInProgress(): boolean {
    const n = this.name?.toLowerCase() ?? '';
    return n === 'in_progress' || n === 'in progress' || n === 'inprogress';
  }

  isResolved(): boolean {
    return this.name?.toLowerCase() === 'resolved';
  }

  isCancelled(): boolean {
    const n = this.name?.toLowerCase() ?? '';
    return n === 'cancelled' || n === 'canceled';
  }
}
