import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { toObjectId } from '../../../core/database/mongo.utils';
import { ClaimCancellation } from '../../domain/models/claim-cancellation.entity';
import { ClaimCancellationRepository } from '../../domain/repositories/claim-cancellation.repository.interface';

@Injectable()
export class ClaimCancellationService implements ClaimCancellationRepository {
  constructor(
    @InjectRepository(ClaimCancellation, 'mongoConnection')
    private readonly repo: MongoRepository<ClaimCancellation>,
  ) {}

  async create(entity: ClaimCancellation): Promise<ClaimCancellation> {
    return this.repo.save(entity as any);
  }

  async findById(id: string): Promise<ClaimCancellation> {
    const c = await this.repo.findOneBy({ id: toObjectId(id) });
    if (!c)
      throw new NotFoundException(
        `No se encuentra la cancelación con ID ${id}`,
      );
    return c;
  }

  async findAll(): Promise<ClaimCancellation[]> {
    return this.repo.find();
  }

  async update(entity: ClaimCancellation): Promise<ClaimCancellation> {
    return this.repo.save(entity as any);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id as any);
  }
}
