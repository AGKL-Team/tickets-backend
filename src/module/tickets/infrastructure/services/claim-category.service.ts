import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClaimCategory } from '../../domain/models/claim-category.entity';
import { Claim } from '../../domain/models/claim.entity';
import { ClaimCategoryRepository } from '../../domain/repositories/claim-category.repository.interface';

@Injectable()
export class ClaimCategoryService implements ClaimCategoryRepository {
  constructor(
    @InjectRepository(ClaimCategory)
    private readonly repo: Repository<ClaimCategory>,
    @InjectRepository(Claim)
    private readonly claimRepo: Repository<Claim>,
  ) {}

  async create(entity: ClaimCategory): Promise<ClaimCategory> {
    return this.repo.save(entity as any);
  }

  async findById(id: string): Promise<ClaimCategory> {
    const c = await this.repo.findOneBy({ id } as any);
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
    const found = await this.repo.findOneBy({ name } as any);
    if (!found)
      throw new NotFoundException(
        `No se encuentra la categoría con nombre '${name}'`,
      );
    return found;
  }

  async hasClaimsAssociated(id: string): Promise<Claim | null> {
    const d = await this.claimRepo.findOneBy({ 'category.id': id } as any);
    return d ?? null;
  }
}
