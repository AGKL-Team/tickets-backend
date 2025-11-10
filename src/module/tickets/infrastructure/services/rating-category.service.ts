import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RatingCategory } from '../../domain/models/rating-category.entity';

@Injectable()
export class RatingCategoryService {
  constructor(
    @InjectRepository(RatingCategory)
    private readonly repo: Repository<RatingCategory>,
  ) {}

  async findById(id: string): Promise<RatingCategory> {
    const r = await this.repo.findOneBy({ id } as any);
    if (!r)
      throw new NotFoundException(
        `No se encuentra la categoria de rating con ID ${id}`,
      );
    return r;
  }

  async findAll(): Promise<RatingCategory[]> {
    return this.repo.find();
  }

  async save(entity: RatingCategory): Promise<RatingCategory> {
    return this.repo.save(entity as any);
  }

  async update(entity: RatingCategory): Promise<RatingCategory> {
    return this.repo.save(entity as any);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id as any);
  }
}
