import { BadRequestException, Injectable } from '@nestjs/common';
import { SubAreaService } from '../../infrastructure/services';

@Injectable()
export class DeleteSubArea {
  constructor(private readonly subAreaService: SubAreaService) {}

  async execute(id: string) {
    const hasClaims = await this.subAreaService.hasClaimsAssociated(id);
    if (hasClaims) {
      throw new BadRequestException(
        'No se puede eliminar una subárea que tiene reclamos asociados',
      );
    }

    await this.subAreaService.delete(id);
    return { deleted: true };
  }
}
