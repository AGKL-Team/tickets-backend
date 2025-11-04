import { BadRequestException, Injectable } from '@nestjs/common';
import { AreaService, SubAreaService } from '../../infrastructure/services';

@Injectable()
export class DeleteArea {
  constructor(
    private readonly areaService: AreaService,
    private readonly subAreaService: SubAreaService,
  ) {}

  async execute(id: string) {
    const hasClaims = await this.areaService.hasClaimsAssociated(id);
    if (hasClaims) {
      throw new BadRequestException(
        'No se puede eliminar un área que tiene reclamos asociados',
      );
    }

    const hasSubAreas = await this.subAreaService.hasSubAreas(id);
    if (hasSubAreas) {
      throw new BadRequestException(
        'No se puede eliminar un área que tiene subáreas asociadas',
      );
    }

    await this.areaService.delete(id);
    return { deleted: true };
  }
}
