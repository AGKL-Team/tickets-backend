import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Claim } from '../../domain/models/claim.entity';
import { ClaimRepository } from '../../domain/repositories/claim.repository.interface';
import { UserRoleService } from './user-role.service';

@Injectable()
export class ClaimService implements ClaimRepository {
  constructor(
    private readonly userRoleService: UserRoleService,
    @InjectRepository(Claim)
    private readonly claimRepository: Repository<Claim>,
  ) {}

  async save(claim: Claim): Promise<Claim> {
    return this.claimRepository.save(claim as any);
  }

  async findById(id: string, userId: string): Promise<Claim> {
    const claim = await this.claimRepository.findOneBy({ id } as any);
    if (!claim)
      throw new NotFoundException(`No se encuentra el reclamo con el ID ${id}`);
    const roles = await this.userRoleService.findByUserId(userId);
    const isAdmin = roles.some((role) => role.role.isAdmin());
    if ((claim as any).clientId !== userId && !isAdmin) {
      throw new ForbiddenException(
        `No tiene acceso al reclamo con el ID ${id}`,
      );
    }
    return claim;
  }

  async findAll(userId: string): Promise<Claim[]> {
    const roles = await this.userRoleService.findByUserId(userId);
    const isAdmin = roles.some((role) => role.role.isAdmin());
    const all = await this.claimRepository.find();
    if (isAdmin) return all;
    return all.filter((c) => (c as any).clientId === userId);
  }

  async update(claim: Claim): Promise<Claim> {
    return this.claimRepository.save(claim);
  }

  async delete(id: string): Promise<void> {
    await this.claimRepository.delete(id);
  }
}
