import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { toObjectId } from '../../../core/database/mongo.utils';
import { ClaimCriticality } from '../../domain/models/claim-criticality.entity';
import { Claim } from '../../domain/models/claim.entity';

@Injectable()
export class ClaimCriticalityService {
  constructor(
    @InjectRepository(ClaimCriticality, 'mongoConnection')
    private readonly criticalityRepository: MongoRepository<ClaimCriticality>,
    @InjectRepository(Claim, 'mongoConnection')
    private readonly claimRepo: MongoRepository<Claim>,
  ) {}

  async save(entity: ClaimCriticality): Promise<ClaimCriticality> {
    return this.criticalityRepository.save(entity as any);
  }

  async findById(id: string): Promise<ClaimCriticality> {
    const c = await this.criticalityRepository.findOneBy({
      _id: toObjectId(id),
    });
    if (!c)
      throw new NotFoundException(`No se encuentra la criticidad con ID ${id}`);
    return c;
  }

  async findAll(): Promise<ClaimCriticality[]> {
    return this.criticalityRepository.find();
  }

  async update(entity: ClaimCriticality): Promise<ClaimCriticality> {
    return this.criticalityRepository.save(entity as any);
  }

  async delete(id: string): Promise<void> {
    await this.criticalityRepository.delete(id as any);
  }

  async hasClaimsAssociated(id: string) {
    const c = await this.claimRepo.findOneBy({ 'criticality.id': id } as any);
    return !!c;
  }
}
