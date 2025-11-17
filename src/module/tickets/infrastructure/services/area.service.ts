import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { toObjectId } from '../../../core/database/mongo.utils';
import { Area } from '../../domain/models/area.entity';
import { Claim } from '../../domain/models/claim.entity';
import { AreaRepository } from '../../domain/repositories/area.repository.interface';

@Injectable()
export class AreaService implements AreaRepository {
  constructor(
    @InjectRepository(Area, 'mongoConnection')
    private readonly repo: MongoRepository<Area>,
    @InjectRepository(Claim, 'mongoConnection')
    private readonly claimRepo: MongoRepository<Claim>,
  ) {}

  async findById(id: string, projectId?: string): Promise<Area> {
    if (projectId) {
      const a = await this.repo.findOne({
        where: { _id: toObjectId(id), project: { id: projectId } } as any,
      });
      if (!a)
        throw new NotFoundException(`No se encuentra el área con ID ${id}`);
      return a;
    }

    const a = await this.repo.findOneBy({ _id: toObjectId(id) });
    if (!a) throw new NotFoundException(`No se encuentra el área con ID ${id}`);
    return a;
  }

  async findAll(projectId?: string): Promise<Area[]> {
    if (projectId) {
      return this.repo.find({ where: { project: { id: projectId } } as any });
    }
    return this.repo.find();
  }

  async save(entity: Area): Promise<Area> {
    return this.repo.save(entity as any);
  }

  async update(area: Area): Promise<Area> {
    return this.repo.save(area as any);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id as any);
  }

  async findByName(name: string): Promise<Area> {
    const a = await this.repo.findOneBy({ name });
    if (!a)
      throw new NotFoundException(`No se encuentra el área con nombre ${name}`);
    return a;
  }

  async findByNameInProject(
    name: string,
    projectId?: string,
  ): Promise<Area | null> {
    // when projectId is provided, search within that project's areas
    if (projectId) {
      const a = await this.repo.findOne({
        where: { name, project: { id: projectId } },
      });
      return a ?? null;
    }

    // when no projectId is provided, search for areas without a project (global areas)
    const a = await this.repo.findOne({ where: { name, project: null } });
    return a ?? null;
  }

  async hasClaimsAssociated(id: string) {
    const c = await this.claimRepo.findOneBy({ 'area.id': id });
    return !!c;
  }
}
