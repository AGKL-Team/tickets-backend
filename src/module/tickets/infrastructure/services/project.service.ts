import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { toObjectId } from '../../../core/database/mongo.utils';
import { Claim } from '../../domain/models/claim.entity';
import { Project } from '../../domain/models/project.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly repo: MongoRepository<Project>,
    @InjectRepository(Claim)
    private readonly claimRepo: MongoRepository<Claim>,
  ) {}

  async save(entity: Project): Promise<Project> {
    return this.repo.save(entity);
  }

  async findById(id: string): Promise<Project> {
    const p = await this.repo.findOneBy({ _id: toObjectId(id) });
    if (!p)
      throw new NotFoundException(`No se encuentra el proyecto con ID ${id}`);
    return p;
  }

  async findAll(): Promise<Project[]> {
    return this.repo.find();
  }

  async update(entity: Project): Promise<Project> {
    return this.repo.save(entity as any);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id as any);
  }

  async hasClaimsAssociated(id: string) {
    const c = await this.claimRepo.findOneBy({ 'project.id': id } as any);
    return !!c;
  }
}
