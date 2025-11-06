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
    const isPending = existing.isPending();
    const isInProgress = existing.isInProgress();
    const userRoles = await this.userRoleService.findByUserId(userId);

    // fetch roles and states (defensive: tests may provide partial mocks)
    const isAdmin = userRoles.some((r: any) =>
      typeof r.isAdmin === 'function'
        ? r.isAdmin()
        : r.role?.isAdmin && r.role.isAdmin(),
    );

    const isClient = userRoles.some((r: any) =>
      typeof r.isClient === 'function'
        ? r.isClient()
        : r.role?.isClient && r.role.isClient(),
    );

    const isAreaManager = userRoles.some(
      (r: any) => r.role?.isAreaManager && r.role.isAreaManager(),
    );

    // Only allow update when claim is in 'pending' or 'in progress'
    if (!isPending && !isInProgress) {
      throw new ConflictException(
        'Sólo se puede actualizar un reclamo en estado pendiente o en progreso',
      );
    }

    // Clients may only update their own claims and only the description or the area
    if (isClient) {
      if (userId !== existing.clientId)
        throw new ForbiddenException(
          'No se puede modificar un reclamo de otro usuario',
        );

      const forbiddenForClient =
        request.issue !== undefined ||
        request.priorityId !== undefined ||
        request.date !== undefined ||
        request.categoryId !== undefined ||
        request.projectId !== undefined;

      if (forbiddenForClient) {
        throw new ForbiddenException(
          'Los clientes sólo pueden modificar la descripción o el área del reclamo',
        );
      }
    }

    // if the issue is provided
    // if the issue is provided (only admin)
    if (request.issue !== undefined) {
      if (!isAdmin)
        throw new ForbiddenException(
          'Solo un administrador puede modificar el asunto',
        );

      if (!isPending)
        throw new BadRequestException(
          'Solo se puede actualizar el asunto del reclamo en estado pendiente',
        );

      existing.changeIssue(request.issue);
    }

    // if the priority is provided
    // if the priority is provided (admin or areaManager)
    if (request.priorityId !== undefined) {
      if (!isAdmin && !isAreaManager)
        throw new ForbiddenException(
          'Solo un administrador o AreaManager puede asignar prioridad',
        );

      const priority = await this.priorityService.findById(request.priorityId);

      if (!isPending && !isInProgress) {
        throw new BadRequestException(
          'Solo se puede asignar una prioridad a un reclamo en estado pendiente o en progreso.',
        );
      }

      existing.changePriority(priority);
    }

    // if the date is provided
    // if the date is provided (admin only)
    if (request.date !== undefined) {
      if (!isAdmin)
        throw new ForbiddenException(
          'Solo un administrador puede modificar la fecha',
        );

      if (!isPending)
        throw new BadRequestException(
          'Solo se puede modificar la fecha del reclamo en estado pendiente',
        );

      existing.changeDate(new Date(request.date));
    }

    // if the description is provided
    // if the description is provided (allowed for client, admin, areaManager)
    if (request.description !== undefined) {
      if (!isPending && !isInProgress)
        throw new BadRequestException(
          'Solo se puede modificar la descripción de un reclamo en estado pendiente o en progreso',
        );

      existing.changeDescription(request.description);
    }

    // if the category is provided
    // if the category is provided (admin only)
    if (request.categoryId !== undefined) {
      if (!isAdmin)
        throw new ForbiddenException(
          'Solo un administrador puede cambiar una categoría',
        );

      if (!isPending && !isInProgress) {
        throw new BadRequestException(
          'Solo se puede modificar la categoría a un reclamo en estado pendiente o en progreso.',
        );
      }

      const category = await this.categoryService.findById(request.categoryId);
      existing.changeCategory(category);
    }

    // if the area is provided
    // if the area is provided (allowed for admin, areaManager, client-owner)
    if (request.areaId !== undefined) {
      const canChangeArea =
        isAdmin || isAreaManager || (isClient && userId === existing.clientId);
      if (!canChangeArea)
        throw new ForbiddenException(
          'No tiene permisos para modificar el área de este reclamo',
        );

      if (!isPending && !isInProgress)
        throw new BadRequestException(
          'Solo se puede modificar el área de un reclamo en estado pendiente o en progreso.',
        );

      const area = await this.areaService.findById(request.areaId);
      existing.changeArea(area);
    }

    // project cannot be updated once the claim is created
    // project cannot be updated once the claim is created
    if (request.projectId !== undefined) {
      throw new BadRequestException(
        'El proyecto no puede ser actualizado una vez creado el reclamo',
      );
    }

    // save the changes
    const updated = await this.claimService.update(existing);

    return updated;
  }
}
