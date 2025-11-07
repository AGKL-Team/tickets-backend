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
import { ClaimComment } from './claim-comment.entity';
import { ClaimCriticality } from './claim-criticality.entity';
import { ClaimHistory } from './claim-history.entity';
import { ClaimRating } from './claim-rating.entity';
import { ClaimState } from './claim-state.entity';
import { Priority } from './priority.entity';
import { Project } from './project.entity';
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

  @ManyToOne(() => Project, (project) => project.claims, {
    eager: true,
    nullable: true,
  })
  project?: Project;

  @ManyToOne(() => ClaimCriticality, (c) => c.claims, {
    eager: true,
    nullable: true,
  })
  criticality?: ClaimCriticality;

  @OneToMany(() => ClaimHistory, (h) => h.claim, {
    cascade: true,
  })
  history!: ClaimHistory[];

  @OneToMany(() => ClaimComment, (c) => c.claim, { cascade: true })
  comments?: ClaimComment[];

  @OneToOne(() => ClaimRating, (r) => r.claim, {
    cascade: true,
    eager: true,
    nullable: true,
  })
  rating?: ClaimRating | null;

  @Column('varchar')
  number!: string;

  @Column('uuid')
  clientId!: string;

  @Column({ type: 'uuid', nullable: true })
  claimResolverId!: string | null;

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

  changeIssue(issue: string, operatorId?: string) {
    const prev = this.issue;
    this.issue = issue;
    const entry = ClaimHistory.create(
      `Cambio de asunto: "${prev}" -> "${issue}". Estado: "${this.state?.name ?? ''}"`,
      this.state,
      this,
      false,
      operatorId,
    );

    entry.state = this.state;
    this.addHistoryEntry(entry);
  }

  changeDescription(description: string, operatorId?: string) {
    const prev = this.description;
    this.description = description;
    const entry = ClaimHistory.create(
      `Cambio de descripción: "${prev ?? ''}" -> "${description ?? ''}". Estado: "${this.state?.name ?? ''}"`,
      this.state,
      this,
      false,
      operatorId,
    );
    this.addHistoryEntry(entry);
  }

  changeCategory(category: ClaimCategory, operatorId?: string) {
    const prev = this.category?.name;
    this.category = category;
    const entry = ClaimHistory.create(
      `Cambio de categoría: "${prev ?? ''}" -> "${category?.name ?? ''}". Estado: "${this.state?.name ?? ''}"`,
      this.state,
      this,
      true,
      operatorId,
    );

    this.addHistoryEntry(entry);
  }

  changeDate(date: Date, operatorId?: string) {
    const prev = this.date;
    this.date = date;
    const entry = ClaimHistory.create(
      `Cambio de fecha: "${prev?.toISOString() ?? ''}" -> "${date?.toISOString() ?? ''}". Estado: "${this.state?.name ?? ''}"`,
      this.state,
      this,
      false,
      operatorId,
    );

    this.addHistoryEntry(entry);
  }

  changePriority(priority: Priority, operatorId?: string) {
    const prev = this.priority?.number;
    this.priority = priority;
    const entry = ClaimHistory.create(
      `Cambio de prioridad: "${prev ?? ''}" -> "${priority?.number ?? ''}". Estado: "${this.state?.name ?? ''}"`,
      this.state,
      this,
      true,
      operatorId,
    );

    this.addHistoryEntry(entry);
  }

  changeArea(area: Area, operatorId?: string) {
    const prev = this.area?.name;
    this.area = area;
    const entry = ClaimHistory.create(
      `Cambio de área: "${prev ?? ''}" -> "${area?.name ?? ''}". Estado: "${this.state?.name ?? ''}"`,
      this.state,
      this,
      true,
      operatorId,
    );

    this.addHistoryEntry(entry);
  }

  changeProject(project: Project, operatorId?: string) {
    // once project is assigned at creation, it cannot be updated
    if (this.project)
      throw new BadRequestException(
        'El proyecto no puede ser actualizado una vez creado el reclamo',
      );

    const prev = (this.project as Project | undefined)?.name;
    this.project = project;
    const entry = ClaimHistory.create(
      `Cambio de proyecto: "${prev ?? ''}" -> "${project?.name ?? ''}". Estado: "${this.state?.name ?? ''}"`,
      this.state,
      this,
      true,
      operatorId,
    );

    this.addHistoryEntry(entry);
  }

  changeSubArea(subArea: SubArea, operatorId?: string) {
    const prev = this.subArea?.name;
    this.subArea = subArea;
    const entry = ClaimHistory.create(
      `Cambio de sub-área: "${prev ?? ''}" -> "${subArea?.name ?? ''}". Estado: "${this.state?.name ?? ''}"`,
      this.state,
      this,
      true,
      operatorId,
    );

    this.addHistoryEntry(entry);
  }

  changeCriticality(criticality: ClaimCriticality, operatorId?: string) {
    const prev = this.criticality?.level;
    this.criticality = criticality;
    const entry = ClaimHistory.create(
      `Cambio de criticidad: "${prev ?? ''}" -> "${criticality?.level ?? ''}". Estado: "${this.state?.name ?? ''}"`,
      this.state,
      this,
      true,
      operatorId,
    );

    this.addHistoryEntry(entry);
  }

  addComment(comment: ClaimComment) {
    if (!this.comments) this.comments = [];
    this.comments.push(comment);
  }

  removeComment(commentId: string) {
    if (!this.comments) return;
    this.comments = this.comments.filter((c) => c.id !== commentId);
  }

  private addHistoryEntry(entry: ClaimHistory) {
    // ensure the history is defined
    if (!this.history) this.history = [];

    // add the history to list
    this.history.push(entry);
  }

  start(newState?: ClaimState, operatorId?: string) {
    const prev = this.state;
    if (newState) this.state = newState;
    const entry = ClaimHistory.create(
      `Inicio de gestión. Estado: "${prev?.name ?? ''}" -> "${this.state?.name ?? ''}"`,
      this.state,
      this,
      false,
      operatorId,
    );

    this.addHistoryEntry(entry);
  }

  /**
   * Mark the claim as 'Resolved' state
   * @param resolverId ID of the claim resolver
   */
  resolve(resolverId?: string, operatorId?: string) {
    const prev = this.state;
    this.claimResolverId = resolverId ?? null;
    const entry = ClaimHistory.create(
      `Reclamo resuelto. Estado: "${prev?.name ?? ''}" -> "${this.state?.name ?? ''}"`,
      this.state,
      this,
      false,
      operatorId,
    );

    this.addHistoryEntry(entry);
  }

  /**
   * Assign a responsible resolver for the claim. This is intended to be
   * called by an AreaManager (permission checks should be enforced by the
   * use-case/controller). The method records the assignment in history.
   * @param resolverId ID of the resolver user
   * @param operatorId ID of the operator performing the assignment (AreaManager)
   */
  assignResolver(resolverId: string, operatorId?: string) {
    const prev = this.claimResolverId;
    this.claimResolverId = resolverId ?? null;

    const entry = ClaimHistory.create(
      `Asignación de responsable: "${prev ?? ''}" -> "${resolverId ?? ''}". Estado: "${this.state?.name ?? ''}"`,
      this.state,
      this,
      false,
      operatorId,
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
      false,
      undefined,
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
    project?: Project,
    criticality?: ClaimCriticality,
  ): Claim {
    const claim = new Claim();
    claim.issue = issue;
    claim.description = description ?? '';
    claim.date = date;
    claim.priority = priority;
    claim.category = category;
    if (area) claim.area = area;
    if (project) claim.project = project;
    if (criticality) claim.criticality = criticality;
    claim.clientId = clientId;
    claim.number = number;

    return claim;
  }
}
