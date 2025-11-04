import { ConflictException, Injectable } from '@nestjs/common';
import { Area } from '../../domain/models/area.entity';
import { AreaService } from '../../infrastructure/services';
import { CreateAreaDto } from '../dto/create-area.dto';

@Injectable()
export class CreateArea {
  constructor(private readonly areaService: AreaService) {}

  async execute(request: CreateAreaDto) {
    const exists = await this.areaService.findByName(
      request.name.toUpperCase(),
    );
    if (exists) {
      throw new ConflictException(
        `Ya existe un área con el nombre ${request.name}`,
      );
    }

    const area = Area.create(request.name, request.description);
    const created = await this.areaService.save(area);
    return created.id;
  }
}
