import { ForbiddenException, Injectable } from '@nestjs/common';
import { ProjectService, UserRoleService } from '../../infrastructure/services';

@Injectable()
export class UpdateProject {
  constructor(
    private readonly projectService: ProjectService,
    private readonly userRoleService: UserRoleService,
  ) {}

  async execute(
    id: string,
    name: string,
    description: string | undefined,
    userId: string,
  ) {
    const roles = await this.userRoleService.findByUserId(userId);
    if (!roles.some((r) => r.isAdmin()))
      throw new ForbiddenException(
        'Solo un administrador puede modificar proyectos',
      );

    const p = await this.projectService.findById(id);
    p.name = name;
    p.description = description;
    return this.projectService.update(p);
  }
}
