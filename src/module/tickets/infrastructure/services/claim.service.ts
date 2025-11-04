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
    @InjectRepository(Claim)
    private readonly claimRepository: Repository<Claim>,
    private readonly userRoleService: UserRoleService,
  ) {}

  async save(claim: Claim): Promise<Claim> {
    return this.claimRepository.save(claim);
  }

  async findById(id: string, userId: string): Promise<Claim> {
    // load claim including history for the single-claim view
    const claim = await this.claimRepository.findOne({
      where: { id },
      relations: ['history', 'cancellation', 'priority', 'category', 'state'],
    });
    if (!claim)
      throw new NotFoundException(`No se encuentra el reclamo con el ID ${id}`);

    // Validate if the user has access to the claim or if is admin
    const roles = await this.userRoleService.findByUserId(userId);
    const isAdmin = roles.some((role) => role.role.isAdmin());
    if (claim.clientId !== userId && !isAdmin) {
      throw new ForbiddenException(
        `No tiene acceso al reclamo con el ID ${id}`,
      );
    }

    return claim;
  }

  async findAll(userId: string): Promise<Claim[]> {
    const roles = await this.userRoleService.findByUserId(userId);
    const isAdmin = roles.some((role) => role.role.isAdmin());

    // If the user is an admin, return all claims; otherwise, return only claims
    if (isAdmin) {
      // don't include history when returning lists
      return this.claimRepository.find();
    } else {
      return this.claimRepository.find({ where: { clientId: userId } });
    }
  }

  async update(claim: Claim): Promise<Claim> {
    return this.claimRepository.save(claim);
  }

  async delete(id: string): Promise<void> {
    await this.claimRepository.delete(id);
  }
}
