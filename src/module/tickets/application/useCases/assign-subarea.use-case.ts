import { ForbiddenException, Injectable } from '@nestjs/common';
import {
  ClaimService,
  SubAreaService,
  UserRoleService,
} from '../../infrastructure/services';

@Injectable()
export class AssignSubArea {
  constructor(
    private readonly claimService: ClaimService,
    private readonly subAreaService: SubAreaService,
    private readonly userRoleService: UserRoleService,
  ) {}

  /**
   * Assign a sub-area to a claim. Only areaManager or admin can perform this.
   */
  async execute(claimId: string, subAreaId: string, operatorId: string) {
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
      throw new ForbiddenException('No tiene permisos para asignar sub-área');

    const subArea = await this.subAreaService.findById(subAreaId);
    const claim = await this.claimService.findById(claimId, operatorId);
    claim.changeSubArea(subArea, operatorId);
    return this.claimService.update(claim);
  }
}
