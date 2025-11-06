import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Claim } from '../../domain/models';
import { ClaimRating } from '../../domain/models/claim-rating.entity';

@Injectable()
export class ClaimRatingService {
  constructor(
    @InjectRepository(ClaimRating)
    private readonly ratingRepository: Repository<ClaimRating>,
    @InjectRepository(Claim)
    private readonly claimRepository: Repository<Claim>,
  ) {}

  async save(entity: ClaimRating): Promise<ClaimRating> {
    return this.ratingRepository.save(entity);
  }

  async findById(id: string): Promise<ClaimRating> {
    const r = await this.ratingRepository.findOne({ where: { id } });
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
    return this.ratingRepository.save(entity);
  }

  async delete(id: string): Promise<void> {
    await this.ratingRepository.delete(id);
  }

  async findByClaimId(claimId: string) {
    return this.ratingRepository.findOne({ where: { claim: { id: claimId } } });
  }
}
