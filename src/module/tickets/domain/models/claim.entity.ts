import { BadRequestException } from '@nestjs/common';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Area } from './area.entity';
import { ClaimCancellation } from './claim-cancellation.entity';
import { ClaimCategory } from './claim-category.entity';
import { ClaimHistory } from './claim-history.entity';
import { ClaimState } from './claim-state.entity';
import { Priority } from './priority.entity';
import { SubArea } from './sub-area.entity';

@Entity({ name: 'claims' })
export class Claim {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  issue!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'timestamptz', nullable: true })
  date?: Date;

  @ManyToOne(() => ClaimState, (state) => state.claims, { eager: true })
  state!: ClaimState;

  @ManyToOne(() => Priority, (priority) => priority.claims, { eager: true })
  priority!: Priority;

  @ManyToOne(() => ClaimCategory, (category) => category.claims, {
    eager: true,
  })
  category!: ClaimCategory;

  @ManyToOne(() => Area, (area) => area.claims, { eager: true, nullable: true })
  area?: Area;

  @ManyToOne(() => SubArea, (subArea) => subArea.claims, {
    eager: true,
    nullable: true,
  })
  subArea?: SubArea;

  @OneToMany(() => ClaimHistory, (h) => h.claim, {
    cascade: true,
  })
  history?: ClaimHistory[];

  @Column('varchar')
  number: string;

  @Column('uuid')
  clientId!: string;

  @Column({ type: 'uuid', nullable: true })
  claimResolverId: string | null;

  @OneToOne(() => ClaimCancellation, (c) => c.claim, {
    cascade: true,
    nullable: true,
    eager: true,
  })
  @JoinColumn()
  cancellation?: ClaimCancellation | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  changeIssue(issue: string) {
    const prev = this.issue;
    this.issue = issue;
    const entry = ClaimHistory.create(
      `Cambio de asunto: "${prev}" -> "${issue}". Estado: "${this.state?.name ?? ''}"`,
      this.state,
      this,
    );

    entry.state = this.state;
    this.addHistoryEntry(entry);
  }

  changeDescription(description: string) {
    const prev = this.description;
    this.description = description;
    const entry = ClaimHistory.create(
      `Cambio de descripción: "${prev ?? ''}" -> "${description ?? ''}". Estado: "${this.state?.name ?? ''}"`,
      this.state,
      this,
    );
    this.addHistoryEntry(entry);
  }

  changeCategory(category: ClaimCategory) {
    const prev = this.category?.name;
    this.category = category;
    const entry = ClaimHistory.create(
      `Cambio de categoría: "${prev ?? ''}" -> "${category?.name ?? ''}". Estado: "${this.state?.name ?? ''}"`,
      this.state,
      this,
      true,
    );

    this.addHistoryEntry(entry);
  }

  changeDate(date: Date) {
    const prev = this.date;
    this.date = date;
    const entry = ClaimHistory.create(
      `Cambio de fecha: "${prev?.toISOString() ?? ''}" -> "${date?.toISOString() ?? ''}". Estado: "${this.state?.name ?? ''}"`,
      this.state,
      this,
    );

    this.addHistoryEntry(entry);
  }

  changePriority(priority: Priority) {
    const prev = this.priority?.number;
    this.priority = priority;
    const entry = ClaimHistory.create(
      `Cambio de prioridad: "${prev ?? ''}" -> "${priority?.number ?? ''}". Estado: "${this.state?.name ?? ''}"`,
      this.state,
      this,
      true,
    );

    this.addHistoryEntry(entry);
  }

  changeArea(area: Area) {
    const prev = this.area?.name;
    this.area = area;
    const entry = ClaimHistory.create(
      `Cambio de área: "${prev ?? ''}" -> "${area?.name ?? ''}". Estado: "${this.state?.name ?? ''}"`,
      this.state,
      this,
      true,
    );

    this.addHistoryEntry(entry);
  }

  private addHistoryEntry(entry: ClaimHistory) {
    // ensure the history is defined
    if (!this.history) this.history = [];

    // add the history to list
    this.history.push(entry);
  }

  start(newState?: ClaimState) {
    const prev = this.state;
    if (newState) this.state = newState;
    const entry = ClaimHistory.create(
      `Inicio de gestión. Estado: "${prev?.name ?? ''}" -> "${this.state?.name ?? ''}"`,
      this.state,
      this,
    );

    this.addHistoryEntry(entry);
  }

  /**
   * Mark the claim as 'Resolved' state
   * @param resolverId ID of the claim resolver
   */
  resolve(resolverId?: string) {
    const prev = this.state;
    this.claimResolverId = resolverId ?? null;
    const entry = ClaimHistory.create(
      `Reclamo resuelto. Estado: "${prev?.name ?? ''}" -> "${this.state?.name ?? ''}"`,
      this.state,
      this,
    );

    this.addHistoryEntry(entry);
  }

  /**
   * Cancel the claim
   */
  cancel(cancellation: ClaimCancellation, newState: ClaimState) {
    const prev = this.state;

    // ensure the current state is pending or is in progress
    if (!this.isPending() && !this.isInProgress())
      throw new BadRequestException(
        'Solo se puede cancelar un reclamo en estado pendiente o en progreso',
      );

    // ensure the new state is cancelled
    if (!newState.isCancelled())
      throw new BadRequestException(
        'El reclamo tiene que ser cancelado utilizando un estado cancelado',
      );

    // assign the cancellation
    this.cancellation = cancellation;
    this.state = newState;

    const entry = ClaimHistory.create(
      `Reclamo cancelado. | Estado: "${prev.name}" -> "${this.state.name ?? ''}" | Motivo: ${cancellation.name}`,
      this.state,
      this,
    );

    this.addHistoryEntry(entry);
  }

  isPending() {
    return this.state.isPending();
  }

  isInProgress() {
    return this.state.isInProgress();
  }

  static create(
    issue: string,
    date: Date,
    priority: Priority,
    category: ClaimCategory,
    number: string,
    clientId: string,
    description?: string,
    area?: Area,
  ): Claim {
    const claim = new Claim();
    claim.issue = issue;
    claim.description = description ?? '';
    claim.date = date;
    claim.priority = priority;
    claim.category = category;
    if (area) claim.area = area;
    claim.clientId = clientId;
    claim.number = number;

    return claim;
  }
}
