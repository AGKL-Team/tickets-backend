import { ConflictException, Injectable } from '@nestjs/common';
import { AreaService } from '../../infrastructure/services';
import { UpdateAreaDto } from '../dto/update-area.dto';

@Injectable()
export class UpdateArea {
  constructor(private readonly areaService: AreaService) {}

  async execute(id: string, request: UpdateAreaDto) {
    const existing = await this.areaService.findById(id);

    const normalizedName = request.name?.toUpperCase();

    if (normalizedName !== undefined && normalizedName !== existing.name) {
      const another = await this.areaService.findByName(normalizedName);
      if (another) {
        throw new ConflictException(
          `Ya existe un área con el nombre ${request.name}`,
        );
      }
      existing.changeName(normalizedName);
    }

    if (request.description !== undefined) {
      existing.changeDescription(request.description);
    }

    const updated = await this.areaService.update(existing);
    return updated;
  }
}
