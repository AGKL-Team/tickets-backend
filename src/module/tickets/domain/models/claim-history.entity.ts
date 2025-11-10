import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { ClaimState } from './claim-state.entity';
import { Claim } from './claim.entity';

@Entity('claim_histories')
export class ClaimHistory {
  @ObjectIdColumn()
  id!: string;

  @Column({ nullable: true })
  date!: Date;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  state?: ClaimState;

  @Column({ nullable: true, type: 'simple-json' })
  claim!: Claim;

  @Column({ nullable: true })
  operatorId?: string;

  @Column({ nullable: true })
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
