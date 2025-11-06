import { ForbiddenException, Injectable } from '@nestjs/common';
import { ProjectService, UserRoleService } from '../../infrastructure/services';

@Injectable()
export class DeleteProject {
  constructor(
    private readonly projectService: ProjectService,
    private readonly userRoleService: UserRoleService,
  ) {}

  async execute(id: string, userId: string) {
    const roles = await this.userRoleService.findByUserId(userId);
    if (!roles.some((r) => r.isAdmin()))
      throw new ForbiddenException(
        'Solo un administrador puede eliminar proyectos',
      );

    const hasClaims = await this.projectService.hasClaimsAssociated(id);
    if (hasClaims)
      throw new ForbiddenException(
        'No se puede eliminar un proyecto que tiene reclamos asociados',
      );

    await this.projectService.delete(id);
  }
}
