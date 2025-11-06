import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Claim } from '../../domain/models';
import { Project } from '../../domain/models/project.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Claim)
    private readonly claimRepository: Repository<Claim>,
  ) {}

  async save(entity: Project): Promise<Project> {
    return this.projectRepository.save(entity);
  }

  async findById(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({ where: { id } });

    if (!project)
      throw new NotFoundException(
        `No se encuentra el proyecto con el ID ${id}`,
      );

    return project;
  }

  async findAll(): Promise<Project[]> {
    return this.projectRepository.find();
  }

  async update(entity: Project): Promise<Project> {
    return this.projectRepository.save(entity);
  }

  async delete(id: string): Promise<void> {
    await this.projectRepository.delete(id);
  }

  async hasClaimsAssociated(id: string) {
    return await this.claimRepository.findOne({ where: { project: { id } } });
  }
}
