import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClaimCancellation } from '../../domain/models/claim-cancellation.entity';
import { ClaimCancellationRepository } from '../../domain/repositories/claim-cancellation.repository.interface';

@Injectable()
export class ClaimCancellationService implements ClaimCancellationRepository {
  constructor(
    @InjectRepository(ClaimCancellation)
    private readonly repo: Repository<ClaimCancellation>,
  ) {}

  async create(entity: ClaimCancellation): Promise<ClaimCancellation> {
    return this.repo.save(entity);
  }

  async findById(id: string): Promise<ClaimCancellation> {
    const c = await this.repo.findOne({ where: { id } });
    if (!c)
      throw new NotFoundException(
        `No se encuentra la cancelación con el ID ${id}`,
      );
    return c;
  }

  async findAll(): Promise<ClaimCancellation[]> {
    return this.repo.find();
  }

  async update(entity: ClaimCancellation): Promise<ClaimCancellation> {
    return this.repo.save(entity);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
