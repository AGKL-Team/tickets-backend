import { ForbiddenException, Injectable } from '@nestjs/common';
import {
  ClaimCriticalityService,
  UserRoleService,
} from '../../infrastructure/services';

@Injectable()
export class DeleteClaimCriticality {
  constructor(
    private readonly criticalityService: ClaimCriticalityService,
    private readonly userRoleService: UserRoleService,
  ) {}

  async execute(id: string, userId: string) {
    const roles = await this.userRoleService.findByUserId(userId);
    if (!roles.some((r) => r.isAdmin()))
      throw new ForbiddenException(
        'Solo un administrador puede eliminar una criticidad',
      );

    await this.criticalityService.delete(id);
  }
}
