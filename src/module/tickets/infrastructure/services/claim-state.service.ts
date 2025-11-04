import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClaimState } from '../../domain/models/claim-state.entity';
import { ClaimStateRepository } from '../../domain/repositories/claim-state.repository.interface';

@Injectable()
export class ClaimStateService implements ClaimStateRepository {
  constructor(
    @InjectRepository(ClaimState)
    private readonly repo: Repository<ClaimState>,
  ) {}

  async create(entity: ClaimState): Promise<ClaimState> {
    return this.repo.save(entity);
  }

  async findById(id: string): Promise<ClaimState> {
    const s = await this.repo.findOne({ where: { id } });
    if (!s)
      throw new NotFoundException(`No se encuentra el estado con el ID ${id}`);
    return s;
  }

  async findAll(): Promise<ClaimState[]> {
    return this.repo.find();
  }

  async update(entity: ClaimState): Promise<ClaimState> {
    return this.repo.save(entity);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
