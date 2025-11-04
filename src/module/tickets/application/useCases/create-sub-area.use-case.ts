import { ConflictException, Injectable } from '@nestjs/common';
import { SubArea } from '../../domain/models/sub-area.entity';
import { AreaService, SubAreaService } from '../../infrastructure/services';
import { CreateSubAreaDto } from '../dto/create-sub-area.dto';

@Injectable()
export class CreateSubArea {
  constructor(
    private readonly subAreaService: SubAreaService,
    private readonly areaService: AreaService,
  ) {}

  async execute(request: CreateSubAreaDto) {
    const area = await this.areaService.findById(request.areaId);

    const existing = await this.subAreaService.findByName(
      request.name.toUpperCase(),
    );
    if (existing && existing.area?.id === area.id) {
      throw new ConflictException(
        `Ya existe una subárea con el nombre ${request.name} en el área ${area.name}`,
      );
    }

    const sub = SubArea.create(request.name, request.description ?? '', area);
    const created = await this.subAreaService.save(sub);
    return created.id;
  }
}
