import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { toObjectId } from '../../../core/database/mongo.utils';
import { Claim } from '../../domain/models/claim.entity';
import { SubArea } from '../../domain/models/sub-area.entity';
import { SubAreaRepository } from '../../domain/repositories/sub-area.repository.interface';

@Injectable()
export class SubAreaService implements SubAreaRepository {
  constructor(
    @InjectRepository(SubArea)
    private readonly repo: MongoRepository<SubArea>,
    @InjectRepository(Claim)
    private readonly claimRepo: MongoRepository<Claim>,
  ) {}

  async findById(id: string, projectId?: string): Promise<SubArea> {
    if (projectId) {
      const s = await this.repo.findOne({
        where: { _id: toObjectId(id), project: { id: projectId } } as any,
      });
      if (!s)
        throw new NotFoundException(`No se encuentra la sub-área con ID ${id}`);
      return s;
    }

    const s = await this.repo.findOneBy({ id: toObjectId(id) } as any);
    if (!s)
      throw new NotFoundException(`No se encuentra la sub-área con ID ${id}`);
    return s;
  }

  async findAll(projectId?: string): Promise<SubArea[]> {
    if (projectId) {
      return this.repo.find({ where: { project: { id: projectId } } as any });
    }
    return this.repo.find();
  }

  async save(entity: SubArea): Promise<SubArea> {
    return await this.repo.save(entity);
  }

  async update(entity: SubArea): Promise<SubArea> {
    return this.repo.save(entity as any);
  }

  async delete(id: string): Promise<boolean> {
    await this.repo.delete(id);
    return true;
  }

  async findByName(name: string): Promise<SubArea | null> {
    return await this.repo.findOne({ where: { name } });
  }

  async hasClaimsAssociated(id: string) {
    const c = await this.claimRepo.findOneBy({ subArea: { id } });
    return !!c;
  }

  async hasSubAreas(areaId: string) {
    const s = await this.repo.findOneBy({ area: { id: areaId } });
    return !!s;
  }
}
