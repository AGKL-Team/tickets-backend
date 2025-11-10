import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClaimRating } from '../../domain/models/claim-rating.entity';

@Injectable()
export class ClaimRatingService {
  constructor(
    @InjectRepository(ClaimRating)
    private readonly ratingRepository: Repository<ClaimRating>,
  ) {}

  async save(entity: ClaimRating): Promise<ClaimRating> {
    return this.ratingRepository.save(entity as any);
  }

  async findById(id: string): Promise<ClaimRating> {
    const r = await this.ratingRepository.findOneBy({ id } as any);
    if (!r)
      throw new NotFoundException(
        `No se encuentra la calificación con ID ${id}`,
      );
    return r;
  }

  async findAll(): Promise<ClaimRating[]> {
    return this.ratingRepository.find();
  }

  async update(entity: ClaimRating): Promise<ClaimRating> {
    return this.ratingRepository.save(entity as any);
  }

  async delete(id: string): Promise<void> {
    await this.ratingRepository.delete(id as any);
  }

  async findByClaimId(claimId: string) {
    const r = await this.ratingRepository.findOneBy({
      'claim.id': claimId,
    } as any);
    if (!r)
      throw new NotFoundException(
        `No se encuentra la calificación para el reclamo con ID ${claimId}`,
      );
    return r;
  }
}
