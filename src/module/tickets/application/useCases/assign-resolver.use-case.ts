import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserArea } from '../../domain/models';
import {
  ClaimService,
  UserAreaService,
  UserRoleService,
} from '../../infrastructure/services';

@Injectable()
export class AssignResolver {
  constructor(
    private readonly claimService: ClaimService,
    private readonly userRoleService: UserRoleService,
    private readonly userAreaService: UserAreaService,
  ) {}

  /**
   * Assign a resolver to a claim. The assignee must have the 'resolver' role.
   * The caller must be admin or areaManager.
   */
  async execute(claimId: string, resolverId: string, operatorId: string) {
    const operatorRoles = await this.userRoleService.findByUserId(operatorId);
    const isAdmin = operatorRoles.some((r) => r.isAdmin());
    const isAreaManager = operatorRoles.some((r) => r.isAreaManager());

    if (!isAdmin && !isAreaManager)
      throw new ForbiddenException(
        'No tiene permisos para asignar responsables',
      );

    // ensure assignee has resolver role
    const assigneeRoles = await this.userRoleService.findByUserId(resolverId);
    const isResolver = assigneeRoles.some((r) => r.isResolver());

    if (!isResolver)
      throw new ForbiddenException(
        'El usuario asignado no tiene el rol de resolver',
      );

    const claim = await this.claimService.findById(claimId, operatorId);

    // If operator is areaManager (not admin) ensure they are assigned to the claim's area
    if (!isAdmin && isAreaManager) {
      const operatorAreas = await this.userAreaService.findByUserId(operatorId);
      const assignedToClaimArea = operatorAreas.some(
        (ua: UserArea) => ua.area?.id === claim.area?.id,
      );
      if (!assignedToClaimArea)
        throw new ForbiddenException(
          'No está asignado al área del reclamo para realizar esta acción',
        );
    }

    // ensure assignee is assigned to the claim's area
    const assigneeAreas = await this.userAreaService.findByUserId(resolverId);
    const assigneeAssigned = assigneeAreas.some(
      (ua: UserArea) => ua.area?.id === claim.area?.id,
    );
    if (!assigneeAssigned)
      throw new ForbiddenException(
        'El usuario asignado no está asignado al área del reclamo',
      );

    claim.assignResolver(resolverId, operatorId);
    return this.claimService.update(claim);
  }
}
