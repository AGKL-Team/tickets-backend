import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import {
  AreaService,
  ClaimCategoryService,
  ClaimService,
  PriorityService,
  UserRoleService,
} from '../../infrastructure/services';
import { UpdateClaimDto } from '../dto/update-claim.dto';

@Injectable()
export class UpdateClaim {
  constructor(
    private readonly claimService: ClaimService,
    private readonly priorityService: PriorityService,
    private readonly categoryService: ClaimCategoryService,
    private readonly areaService: AreaService,
    private readonly userRoleService: UserRoleService,
  ) {}

  async execute(id: string, request: UpdateClaimDto, userId: string) {
    const existing = await this.claimService.findById(id, userId);

    // ensure the user request it the same who's did the claim
    if (userId !== existing.clientId)
      throw new ForbiddenException(
        'No se puede modificar un reclamo de otro usuario',
      );

    // Only allow update when claim is in 'pending' state
    if (!existing.isPending() || !existing.isInProgress()) {
      throw new ConflictException(
        'Sólo se puede actualizar un reclamo en estado pendiente o en progreso',
      );
    }

    const isPending = existing.isPending();
    const isInProgress = existing.isInProgress();
    const userRoles = await this.userRoleService.findByUserId(userId);

    // if the issue is provided
    if (request.issue !== undefined) {
      // ensure the state is pending
      if (!isPending)
        throw new BadRequestException(
          'Solo se puede actualizar el asunto del reclamo en estado pendiente',
        );

      // update the issue
      existing.changeIssue(request.issue);
    }

    // if the priority is provided
    if (request.priorityId !== undefined) {
      // ensure the user have the admin role to assign a priority
      if (!userRoles.some((role) => role.isAdmin()))
        throw new ForbiddenException(
          'Solo un administrador puede asignar prioridad',
        );

      // ensure the priority exists
      const priority = await this.priorityService.findById(request.priorityId);

      // if the claim is not on any of this states
      if (!isPending && !isInProgress) {
        throw new BadRequestException(
          'Solo se puede asignar una prioridad a un reclamo en estado pendiente o en progreso.',
        );
      }

      // update the priority
      existing.changePriority(priority);
    }

    // if the date is provided
    if (request.date !== undefined) {
      // ensure the state is pending
      if (!isPending)
        throw new BadRequestException(
          'Solo se puede modificar la fecha del reclamo en estado pendiente',
        );

      // update the date
      existing.changeDate(new Date(request.date));
    }

    // if the description is provided
    if (request.description !== undefined) {
      // ensure the state is pending or in progress
      if (!isPending && !isInProgress)
        throw new BadRequestException(
          'Solo se puede modificar la descripción de un reclamo en estado pendiente o en progreso',
        );

      // update the description
      existing.changeDescription(request.description);
    }

    // if the category is provided
    if (request.categoryId !== undefined) {
      // ensure the user have the admin role to change the category
      if (!userRoles.some((role) => role.isAdmin()))
        throw new ForbiddenException(
          'Solo un administrador puede cambiar una categoría',
        );

      // if the claim is not on any of this states
      if (!isPending && !isInProgress) {
        throw new BadRequestException(
          'Solo se puede modificar la categoría a un reclamo en estado pendiente o en progreso.',
        );
      }

      // ensure the category exists
      const category = await this.categoryService.findById(request.categoryId);

      // update the category
      existing.changeCategory(category);
    }

    // if the area is provided
    if (request.areaId !== undefined) {
      // ensure the user request has the admin role
      if (!userRoles.some((role) => role.isAdmin()))
        throw new ForbiddenException(
          'Solo un administrador puede modificar el área de un reclamo',
        );

      if (!isPending && !isInProgress)
        throw new BadRequestException(
          'Solo se puede modificar el área de un reclamo en estado pendiente o en progreso.',
        );

      // ensure the area exists
      const area = await this.areaService.findById(request.areaId);

      // update the area
      existing.changeArea(area);
    }

    // save the changes
    const updated = await this.claimService.update(existing);

    return updated;
  }
}
