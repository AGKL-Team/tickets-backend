import { BadRequestException, Injectable } from '@nestjs/common';
import { Priority } from '../../domain/models';
import { PriorityService } from '../../infrastructure/services';
import { CreatePriorityDto } from '../dto/create-priority.dto';

@Injectable()
export class CreatePriority {
  constructor(private readonly priorityService: PriorityService) {}

  async execute(request: CreatePriorityDto) {
    const existing = await this.priorityService.findByNumber(request.number);
    if (existing) {
      throw new BadRequestException(
        `A priority with the number '${request.number}' already exists`,
      );
    }

    const priority = Priority.create(request.number, request.description);

    const created = await this.priorityService.save(priority);

    return created;
  }
}
