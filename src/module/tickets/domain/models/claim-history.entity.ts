import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ClaimState } from './claim-state.entity';
import { Claim } from './claim.entity';

@Entity({ name: 'claim_histories' })
export class ClaimHistory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'timestamptz' })
  date!: Date;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToOne(() => ClaimState, { eager: true, nullable: true })
  @JoinColumn()
  state?: ClaimState;

  @ManyToOne(() => Claim, (c) => c.history)
  @JoinColumn()
  claim!: Claim;

  @Column({ nullable: true })
  operatorId?: string;

  @Column('bit', { default: false })
  isClasified!: boolean;

  static create(
    description: string,
    state: ClaimState,
    claim: Claim,
    isClasified: boolean = false,
    operatorId?: string,
  ): ClaimHistory {
    const history = new ClaimHistory();
    history.date = new Date();
    history.description = description;
    history.state = state;
    history.claim = claim;
    history.isClasified = isClasified;
    history.operatorId = operatorId;

    return history;
  }
}
