import { ConflictException, Injectable } from '@nestjs/common';
import { Area } from '../../domain/models/area.entity';
import { AreaService, ProjectService } from '../../infrastructure/services';
import { CreateAreaDto } from '../dto/create-area.dto';

@Injectable()
export class CreateArea {
  constructor(
    private readonly areaService: AreaService,
    private readonly projectService: ProjectService,
  ) {}

  async execute(request: CreateAreaDto) {
    const name = request.name.toUpperCase();

    // Check uniqueness scoped to the project (or global when no project provided)
    const exists = await this.areaService.findByNameInProject(
      name,
      request.projectId,
    );

    if (exists) {
      throw new ConflictException(
        `Ya existe un área con el nombre ${request.name}`,
      );
    }

    // If a projectId is provided, resolve the project and attach it to the area
    let project;
    if (request.projectId) {
      project = await this.projectService.findById(request.projectId);
    }

    const area = Area.create(name, request.description, project);
    const created = await this.areaService.save(area);
    return created.id;
  }
}
