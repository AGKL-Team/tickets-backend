import { ForbiddenException, Injectable } from '@nestjs/common';
import { ClaimCriticality } from '../../domain/models/claim-criticality.entity';
import {
  ClaimCriticalityService,
  UserRoleService,
} from '../../infrastructure/services';

@Injectable()
export class CreateClaimCriticality {
  constructor(
    private readonly criticalityService: ClaimCriticalityService,
    private readonly userRoleService: UserRoleService,
  ) {}

  async execute(name: string, description: string | undefined, userId: string) {
    const roles = await this.userRoleService.findByUserId(userId);
    if (!roles.some((r) => r.isAdmin()))
      throw new ForbiddenException(
        'Solo un administrador puede crear una criticidad',
      );

    const c = new ClaimCriticality();
    c.level = name;
    c.description = description;
    return this.criticalityService.save(c);
  }
}
