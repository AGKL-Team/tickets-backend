import { ForbiddenException, Injectable } from '@nestjs/common';
import {
  ClaimCriticalityService,
  UserRoleService,
} from '../../infrastructure/services';

@Injectable()
export class UpdateClaimCriticality {
  constructor(
    private readonly criticalityService: ClaimCriticalityService,
    private readonly userRoleService: UserRoleService,
  ) {}

  async execute(
    id: string,
    level: string,
    description: string | undefined,
    userId: string,
  ) {
    const roles = await this.userRoleService.findByUserId(userId);
    if (!roles.some((r) => r.isAdmin()))
      throw new ForbiddenException(
        'Solo un administrador puede modificar una criticidad',
      );

    const crit = await this.criticalityService.findById(id);
    crit.level = level;
    crit.description = description;
    return this.criticalityService.update(crit);
  }
}
