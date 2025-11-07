import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserArea } from '../../domain/models';
import {
  AreaService,
  ClaimService,
  UserAreaService,
  UserRoleService,
} from '../../infrastructure/services';

@Injectable()
export class TransferArea {
  constructor(
    private readonly claimService: ClaimService,
    private readonly areaService: AreaService,
    private readonly userRoleService: UserRoleService,
    private readonly userAreaService: UserAreaService,
  ) {}

  /**
   * Transfer a claim to another area. Only areaManager or admin can perform this.
   */
  async execute(claimId: string, areaId: string, operatorId: string) {
    const operatorRoles = await this.userRoleService.findByUserId(operatorId);
    const isAdmin = operatorRoles.some((r) => r.isAdmin());
    const isAreaManager = operatorRoles.some((r) => r.isAreaManager());

    if (!isAdmin && !isAreaManager)
      throw new ForbiddenException(
        'No tiene permisos para transferir el área del reclamo',
      );

    const area = await this.areaService.findById(areaId);
    const claim = await this.claimService.findById(claimId, operatorId);

    // If operator is areaManager (not admin) ensure they are assigned to both source and destination areas
    if (!isAdmin && isAreaManager) {
      const operatorAreas = await this.userAreaService.findByUserId(operatorId);
      const assignedToSource = operatorAreas.some(
        (ua: UserArea) => ua.area?.id === claim.area?.id,
      );
      const assignedToDest = operatorAreas.some(
        (ua: UserArea) => ua.area?.id === area.id,
      );
      if (!assignedToSource || !assignedToDest)
        throw new ForbiddenException(
          'No tiene permisos sobre el área origen o destino para transferir este reclamo',
        );
    }

    claim.changeArea(area, operatorId);
    return this.claimService.update(claim);
  }
}
