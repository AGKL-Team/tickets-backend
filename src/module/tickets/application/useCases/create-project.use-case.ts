import { ForbiddenException, Injectable } from '@nestjs/common';
import { Project } from '../../domain/models/project.entity';
import { ProjectService, UserRoleService } from '../../infrastructure/services';

@Injectable()
export class CreateProject {
  constructor(
    private readonly projectService: ProjectService,
    private readonly userRoleService: UserRoleService,
  ) {}

  async execute(name: string, description: string | undefined, userId: string) {
    const roles = await this.userRoleService.findByUserId(userId);
    if (!roles.some((r) => r.isAdmin()))
      throw new ForbiddenException(
        'Solo un administrador puede crear proyectos',
      );

    const p = new Project();
    p.name = name;
    p.description = description;
    return this.projectService.save(p);
  }
}
