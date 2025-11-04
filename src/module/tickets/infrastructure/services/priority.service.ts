import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Claim } from '../../domain/models';
import { Priority } from '../../domain/models/priority.entity';
import { PriorityRepository } from '../../domain/repositories/priority.repository.interface';

@Injectable()
export class PriorityService implements PriorityRepository {
  constructor(
    @InjectRepository(Priority)
    private readonly priorityRepository: Repository<Priority>,
    @InjectRepository(Claim)
    private readonly claimRepository: Repository<Claim>,
  ) {}

  async save(entity: Priority): Promise<Priority> {
    return this.priorityRepository.save(entity);
  }

  async findById(id: string): Promise<Priority> {
    const priority = await this.priorityRepository.findOne({ where: { id } });

    if (!priority)
      throw new NotFoundException(
        `No se encuentra la prioridad con el ID ${id}`,
      );

    return priority;
  }

  async findAll(): Promise<Priority[]> {
    return this.priorityRepository.find();
  }

  async update(entity: Priority): Promise<Priority> {
    return this.priorityRepository.save(entity);
  }

  async delete(id: string): Promise<void> {
    await this.priorityRepository.delete(id);
  }

  async findByNumber(number: number) {
    return this.priorityRepository.findOne({ where: { number } });
  }

  async hasClaimsAssociated(id: string) {
    return await this.claimRepository.findOne({ where: { priority: { id } } });
  }
}
