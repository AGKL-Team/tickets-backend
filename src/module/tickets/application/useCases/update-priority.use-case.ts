import { ConflictException, Injectable } from '@nestjs/common';
import { PriorityService } from '../../infrastructure/services';
import { UpdatePriorityDto } from '../dto/update-priority.dto';

@Injectable()
export class UpdatePriority {
  constructor(private readonly priorityService: PriorityService) {}

  async execute(id: string, request: UpdatePriorityDto) {
    const existing = await this.priorityService.findById(id);

    // if number is changing, ensure uniqueness
    if (request.number !== undefined && request.number !== existing.number) {
      const other = await this.priorityService.findByNumber(request.number);
      if (other) {
        throw new ConflictException(
          `Ya existe una prioridad con el número ${request.number}`,
        );
      }
      existing.changeNumber(request.number);
    }

    if (request.description !== undefined) {
      existing.changeDescription(request.description);
    }

    const updated = await this.priorityService.save(existing);
    return updated;
  }
}
