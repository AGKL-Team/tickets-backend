import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Claim } from '../../domain/models';
import { ClaimCriticality } from '../../domain/models/claim-criticality.entity';

@Injectable()
export class ClaimCriticalityService {
  constructor(
    @InjectRepository(ClaimCriticality)
    private readonly criticalityRepository: Repository<ClaimCriticality>,
    @InjectRepository(Claim)
    private readonly claimRepository: Repository<Claim>,
  ) {}

  async save(entity: ClaimCriticality): Promise<ClaimCriticality> {
    return this.criticalityRepository.save(entity);
  }

  async findById(id: string): Promise<ClaimCriticality> {
    const crit = await this.criticalityRepository.findOne({ where: { id } });

    if (!crit)
      throw new NotFoundException(
        `No se encuentra la criticidad con el ID ${id}`,
      );

    return crit;
  }

  async findAll(): Promise<ClaimCriticality[]> {
    return this.criticalityRepository.find();
  }

  async update(entity: ClaimCriticality): Promise<ClaimCriticality> {
    return this.criticalityRepository.save(entity);
  }

  async delete(id: string): Promise<void> {
    await this.criticalityRepository.delete(id);
  }

  async hasClaimsAssociated(id: string) {
    return await this.claimRepository.findOne({
      where: { criticality: { id } },
    });
  }
}
