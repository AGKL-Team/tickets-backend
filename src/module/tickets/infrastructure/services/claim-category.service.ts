import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Claim } from '../../domain/models';
import { ClaimCategory } from '../../domain/models/claim-category.entity';
import { ClaimCategoryRepository } from '../../domain/repositories/claim-category.repository.interface';

@Injectable()
export class ClaimCategoryService implements ClaimCategoryRepository {
  constructor(
    @InjectRepository(ClaimCategory)
    private readonly repo: Repository<ClaimCategory>,
    @InjectRepository(Claim)
    private readonly claimRepository: Repository<Claim>,
  ) {}

  async create(entity: ClaimCategory): Promise<ClaimCategory> {
    return this.repo.save(entity);
  }

  async findById(id: string): Promise<ClaimCategory> {
    const cat = await this.repo.findOne({ where: { id } });
    if (!cat)
      throw new NotFoundException(
        `No se encuentra la categoría con el ID ${id}`,
      );
    return cat;
  }

  async findAll(): Promise<ClaimCategory[]> {
    return this.repo.find();
  }

  async update(entity: ClaimCategory): Promise<ClaimCategory> {
    return this.repo.save(entity);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async findByName(name: string) {
    return this.repo.findOne({ where: { name } });
  }

  async hasClaimsAssociated(id: string): Promise<Claim | null> {
    return await this.claimRepository.findOne({ where: { category: { id } } });
  }
}
