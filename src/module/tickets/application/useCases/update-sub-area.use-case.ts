import { ConflictException, Injectable } from '@nestjs/common';
import { AreaService, SubAreaService } from '../../infrastructure/services';
import { UpdateSubAreaDto } from '../dto/update-sub-area.dto';

@Injectable()
export class UpdateSubArea {
  constructor(
    private readonly subAreaService: SubAreaService,
    private readonly areaService: AreaService,
  ) {}

  async execute(id: string, request: UpdateSubAreaDto) {
    const existing = await this.subAreaService.findById(id);

    const normalizedName = request.name?.toUpperCase();

    if (normalizedName !== undefined && normalizedName !== existing.name) {
      const other = await this.subAreaService.findByName(normalizedName);
      if (other && other.area?.id === existing.area?.id) {
        throw new ConflictException(
          `Ya existe una subárea con el nombre ${request.name} en el área actual`,
        );
      }
      existing.changeName(normalizedName);
    }

    if (request.description !== undefined)
      existing.changeDescription(request.description);

    if (request.areaId !== undefined) {
      const area = await this.areaService.findById(request.areaId);
      existing.changeArea(area);
    }

    const updated = await this.subAreaService.update(existing);
    return updated;
  }
}
