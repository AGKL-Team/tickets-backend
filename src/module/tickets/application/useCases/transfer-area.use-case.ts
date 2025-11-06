import { ForbiddenException, Injectable } from '@nestjs/common';
import {
  AreaService,
  ClaimService,
  UserRoleService,
} from '../../infrastructure/services';

@Injectable()
export class TransferArea {
  constructor(
    private readonly claimService: ClaimService,
    private readonly areaService: AreaService,
    private readonly userRoleService: UserRoleService,
  ) {}

  /**
   * Transfer a claim to another area. Only areaManager or admin can perform this.
   */
  async execute(claimId: string, areaId: string, operatorId: string) {
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
        'No tiene permisos para transferir el área del reclamo',
      );

    const area = await this.areaService.findById(areaId);
    const claim = await this.claimService.findById(claimId, operatorId);
    claim.changeArea(area, operatorId);
    return this.claimService.update(claim);
  }
}
