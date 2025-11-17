import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { toObjectId } from '../../../core/database/mongo.utils';
import { Claim } from '../../domain/models/claim.entity';
import { ClaimRepository } from '../../domain/repositories/claim.repository.interface';

@Injectable()
export class ClaimService implements ClaimRepository {
  constructor(
    @InjectRepository(Claim, 'mongoConnection')
    private readonly claimRepository: MongoRepository<Claim>,
  ) {}

  async save(claim: Claim): Promise<Claim> {
    return this.claimRepository.save(claim as any);
  }

  async findById(
    id: string,
    userId: string,
    projectId?: string,
  ): Promise<Claim> {
    let claim: Claim | null = null;
    if (projectId) {
      claim = await this.claimRepository.findOne({
        where: { _id: toObjectId(id), project: { id: projectId } } as any,
      });
    } else {
      claim = await this.claimRepository.findOneBy({ _id: toObjectId(id) });
    }
    if (!claim)
      throw new NotFoundException(`No se encuentra el reclamo con el ID ${id}`);

    // const roles = await this.userRoleService.findByUserId(userId);
    // const isAdmin = roles.some((role) => role.role.isAdmin());
    // if ((claim as any).clientId !== userId && !isAdmin) {
    //   throw new ForbiddenException(
    //     `No tiene acceso al reclamo con el ID ${id}`,
    //   );
    // }
    return claim;
  }

  async findAll(userId: string, projectId?: string): Promise<Claim[]> {
    return await this.claimRepository.find({
      where: {
        projectId,
        userId,
      },
    });
  }

  async update(claim: Claim): Promise<Claim> {
    return this.claimRepository.save(claim);
  }

  async delete(id: string): Promise<void> {
    await this.claimRepository.delete(id);
  }
}
