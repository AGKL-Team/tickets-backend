import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserArea } from '../../domain/models';
import {
  ClaimService,
  SubAreaService,
  UserAreaService,
  UserRoleService,
} from '../../infrastructure/services';

@Injectable()
export class AssignSubArea {
  constructor(
    private readonly claimService: ClaimService,
    private readonly subAreaService: SubAreaService,
    private readonly userRoleService: UserRoleService,
    private readonly userAreaService: UserAreaService,
  ) {}

  /**
   * Assign a sub-area to a claim. Only areaManager or admin can perform this.
   */
  async execute(claimId: string, subAreaId: string, operatorId: string) {
    const operatorRoles = await this.userRoleService.findByUserId(operatorId);
    const isAdmin = operatorRoles.some((r) => r.isAdmin());
    const isAreaManager = operatorRoles.some((r) => r.isAreaManager());

    if (!isAdmin && !isAreaManager)
      throw new ForbiddenException('No tiene permisos para asignar sub-área');

    const subArea = await this.subAreaService.findById(subAreaId);
    const claim = await this.claimService.findById(claimId, operatorId);

    // If operator is areaManager (not admin) ensure they are assigned to the claim's area
    if (!isAdmin && isAreaManager) {
      const operatorAreas = await this.userAreaService.findByUserId(operatorId);
      const assignedToClaimArea = operatorAreas.some(
        (ua: UserArea) => ua.areaId === claim.area?.id,
      );
      const assignedToTargetArea = operatorAreas.some(
        (ua: UserArea) => ua.areaId === subArea.area?.id,
      );
      if (!assignedToClaimArea || !assignedToTargetArea)
        throw new ForbiddenException(
          'No tiene permisos sobre el área origen o destino para asignar esta sub-área',
        );
    }

    claim.changeSubArea(subArea, operatorId);
    return this.claimService.update(claim);
  }
}
