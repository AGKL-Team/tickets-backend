import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { toObjectId } from '../../../core/database/mongo.utils';
import { ClaimCategory } from '../../domain/models/claim-category.entity';
import { Claim } from '../../domain/models/claim.entity';
import { ClaimCategoryRepository } from '../../domain/repositories/claim-category.repository.interface';

@Injectable()
export class ClaimCategoryService implements ClaimCategoryRepository {
  constructor(
    @InjectRepository(ClaimCategory)
    private readonly repo: MongoRepository<ClaimCategory>,
    @InjectRepository(Claim)
    private readonly claimRepo: MongoRepository<Claim>,
  ) {}

  async create(entity: ClaimCategory): Promise<ClaimCategory> {
    return this.repo.save(entity as any);
  }

  async findById(id: string): Promise<ClaimCategory> {
    // Use the shared toObjectId helper for id lookups so both string and
    // ObjectId inputs are handled consistently across services.
    const c = await this.repo.findOneBy({ id: toObjectId(id) } as any);
    if (!c)
      throw new NotFoundException(`No se encuentra la categoría con ID ${id}`);
    return c;
  }

  async findAll(): Promise<ClaimCategory[]> {
    return this.repo.find();
  }

  async update(entity: ClaimCategory): Promise<ClaimCategory> {
    return this.repo.save(entity as any);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id as any);
  }

  async findByName(name: string) {
    return await this.repo.findOneBy({ name } as any);
  }

  async hasClaimsAssociated(id: string): Promise<Claim | null> {
    // Find a claim that has this category id via the relation
    const d = await this.claimRepo.findOne({
      where: { category: { id: toObjectId(id) } } as any,
    });
    return d ?? null;
  }
}
