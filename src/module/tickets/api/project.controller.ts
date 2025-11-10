import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { User } from '@supabase/supabase-js';
import { UserFromRequest } from '../../core/auth/infrastructure/decorators/user.decorator';
import {
  Roles,
  RolesGuard,
  SupabaseAuthGuard,
} from '../../core/auth/infrastructure/guard';
import { CreateProjectDto } from '../application/dto/create-project.dto';
import { CreateUserProjectDto } from '../application/dto/create-user-project.dto';
import { UpdateProjectDto } from '../application/dto/update-project.dto';
import { CreateProject } from '../application/useCases/create-project.use-case';
import { DeleteProject } from '../application/useCases/delete-project.use-case';
import { UpdateProject } from '../application/useCases/update-project.use-case';
import {
  ProjectService,
  UserProjectService,
  UserRoleService,
} from '../infrastructure/services';

@UseGuards(SupabaseAuthGuard, RolesGuard)
@Controller('projects')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly userProjectService: UserProjectService,
    private readonly userRoleService: UserRoleService,
    private readonly createProject: CreateProject,
    private readonly updateProject: UpdateProject,
    private readonly deleteProject: DeleteProject,
  ) {}

  @Post()
  @Roles('admin')
  async create(
    @Body(ValidationPipe) request: CreateProjectDto,
    @UserFromRequest() user: User,
  ) {
    return await this.createProject.execute(
      request.name,
      request.description,
      user.id,
    );
  }

  @Get()
  async findAll(@UserFromRequest() user: User) {
    const roles = await this.userRoleService.findByUserId(user.id);
    const isAdmin = roles.some((r) => r.isAdmin());
    if (isAdmin) return this.projectService.findAll();
    // clients only see projects they are associated with
    return this.userProjectService.findProjectsByUserId(user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @UserFromRequest() user: User) {
    const roles = await this.userRoleService.findByUserId(user.id);
    const isAdmin = roles.some((r) => r.isAdmin());
    if (isAdmin) return this.projectService.findById(id);

    const isAssociated = await this.userProjectService.isUserAssociated(
      user.id,
      id,
    );
    if (!isAssociated) return null; // or throw Forbidden? keep null for consistency with other controllers
    return this.projectService.findById(id);
  }

  @Put(':id')
  @Roles('admin')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) request: UpdateProjectDto,
    @UserFromRequest() user: User,
  ) {
    return await this.updateProject.execute(
      id,
      request.name ?? '',
      request.description,
      user.id,
    );
  }

  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: string, @UserFromRequest() user: User) {
    await this.deleteProject.execute(id, user.id);
    return { deleted: true };
  }

  // Admin endpoints to manage project-client associations
  @Post(':id/clients')
  @Roles('admin')
  async addClient(
    @Param('id') id: string,
    @Body(ValidationPipe) body: CreateUserProjectDto,
  ) {
    return this.userProjectService.addUserToProject(body.userId, id);
  }

  @Delete(':id/clients/:userId')
  @Roles('admin')
  async removeClient(@Param('id') id: string, @Param('userId') userId: string) {
    await this.userProjectService.removeUserFromProject(userId, id);
    return { removed: true };
  }
}
