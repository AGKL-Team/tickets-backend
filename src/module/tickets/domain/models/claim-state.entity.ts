import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Claim } from './claim.entity';

@Entity({ name: 'claim_states' })
export class ClaimState {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;

  @OneToMany(() => Claim, (claim) => claim.state)
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
