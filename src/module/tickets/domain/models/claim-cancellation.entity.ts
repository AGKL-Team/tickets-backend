import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Claim } from './claim.entity';

@Entity({ name: 'claim_cancellations' })
export class ClaimCancellation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @OneToOne(() => Claim, (claim) => claim.cancellation)
  claim?: Claim;

  changeName(name: string) {
    this.name = name;
  }

  changeDescription(description: string) {
    this.description = description;
  }
}
