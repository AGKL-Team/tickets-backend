import { ForbiddenException, Injectable } from '@nestjs/common';
import { ClaimService, UserRoleService } from '../../infrastructure/services';

@Injectable()
export class AssignResolver {
  constructor(
    private readonly claimService: ClaimService,
    private readonly userRoleService: UserRoleService,
  ) {}

  /**
   * Assign a resolver to a claim. The assignee must have the 'resolver' role.
   * The caller must be admin or areaManager.
   */
  async execute(claimId: string, resolverId: string, operatorId: string) {
    const operatorRoles = await this.userRoleService.findByUserId(operatorId);
    const isAdmin = operatorRoles.some((r: any) =>
      typeof r.isAdmin === 'function'
        ? r.isAdmin()
        : r.role?.isAdmin && r.role.isAdmin(),
    );
    const isAreaManager = operatorRoles.some(
      (r: any) => r.role?.isAreaManager && r.role.isAreaManager(),
    );

    if (!isAdmin && !isAreaManager)
      throw new ForbiddenException(
        'No tiene permisos para asignar responsables',
      );

    // ensure assignee has resolver role
    const assigneeRoles = await this.userRoleService.findByUserId(resolverId);
    const isResolver = assigneeRoles.some((r: any) =>
      typeof r.isResolver === 'function'
        ? r.isResolver()
        : r.role?.isResolver && r.role.isResolver(),
    );

    if (!isResolver)
      throw new ForbiddenException(
        'El usuario asignado no tiene el rol de resolver',
      );

    const claim = await this.claimService.findById(claimId, operatorId);
    claim.assignResolver(resolverId, operatorId);
    return this.claimService.update(claim);
  }
}
