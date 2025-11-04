import { ConflictException, Injectable } from '@nestjs/common';
import { PriorityService } from '../../infrastructure/services';

@Injectable()
export class DeletePriority {
  constructor(private readonly priorityService: PriorityService) {}

  async execute(id: string) {
    const hasAssociated = await this.priorityService.hasClaimsAssociated(id);
    if (hasAssociated !== null) {
      throw new ConflictException('La prioridad tiene reclamos asociados');
    }

    await this.priorityService.delete(id);
    return { deleted: true };
  }
}
