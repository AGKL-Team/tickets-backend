import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { toObjectId } from '../../../core/database/mongo.utils';
import { ClaimState } from '../../domain/models/claim-state.entity';
import { ClaimStateRepository } from '../../domain/repositories/claim-state.repository.interface';

@Injectable()
export class ClaimStateService implements ClaimStateRepository {
  constructor(
    @InjectRepository(ClaimState)
    private readonly repo: MongoRepository<ClaimState>,
  ) {}

  async create(entity: ClaimState): Promise<ClaimState> {
    return this.repo.save(entity as any);
  }

  async findById(id: string): Promise<ClaimState> {
    const r = await this.repo.findOneBy({ _id: toObjectId(id) } as any);
    if (!r)
      throw new NotFoundException(`No se encuentra el estado con ID ${id}`);
    return r;
  }

  async findAll(): Promise<ClaimState[]> {
    return this.repo.find();
  }

  async update(entity: ClaimState): Promise<ClaimState> {
    return this.repo.save(entity as any);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id as any);
  }
}
