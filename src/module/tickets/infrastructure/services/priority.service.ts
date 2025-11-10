import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { toObjectId } from '../../../core/database/mongo.utils';
import { Claim } from '../../domain/models/claim.entity';
import { Priority } from '../../domain/models/priority.entity';
import { PriorityRepository } from '../../domain/repositories/priority.repository.interface';

@Injectable()
export class PriorityService implements PriorityRepository {
  constructor(
    @InjectRepository(Priority)
    private readonly priorityRepository: MongoRepository<Priority>,
    @InjectRepository(Claim)
    private readonly claimRepository: MongoRepository<Claim>,
  ) {}

  async save(entity: Priority): Promise<Priority> {
    return this.priorityRepository.save(entity as any);
  }

  async findById(id: string): Promise<Priority> {
    const p = await this.priorityRepository.findOneBy({
      _id: toObjectId(id),
    });
    if (!p)
      throw new NotFoundException(`No se encuentra la prioridad con ID ${id}`);
    return p;
  }

  async findAll(): Promise<Priority[]> {
    return this.priorityRepository.find();
  }

  async update(entity: Priority): Promise<Priority> {
    return this.priorityRepository.save(entity as any);
  }

  async delete(id: string): Promise<void> {
    await this.priorityRepository.delete(id as any);
  }

  async findByNumber(number: number): Promise<Priority | null> {
    const p = await this.priorityRepository.findOneBy({ number });
    return p ?? null;
  }

  async hasClaimsAssociated(id: string) {
    const c = await this.claimRepository.findOneBy({
      'priority.id': id,
    } as any);
    return !!c;
  }
}
