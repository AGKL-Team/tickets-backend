import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { toObjectId } from '../../../core/database/mongo.utils';
import { Project, UserProject } from '../../domain/models';

@Injectable()
export class UserProjectService {
  constructor(
    @InjectRepository(UserProject, 'mongoConnection')
    private readonly repo: MongoRepository<UserProject>,
    @InjectRepository(Project, 'mongoConnection')
    private readonly projectRepo: MongoRepository<Project>,
  ) {}

  async addUserToProject(userId: string, projectId: string) {
    const exists = await this.repo.findOneBy({ userId, projectId } as any);
    if (exists) return exists;
    const up = UserProject.create(userId, projectId);
    return this.repo.save(up as any);
  }

  async removeUserFromProject(userId: string, projectId: string) {
    await this.repo.delete({ userId, projectId } as any);
    return true;
  }

  async findProjectIdsByUserId(userId: string) {
    const list = await this.repo.find({ where: { userId } as any });
    return list.map((l) => l.projectId);
  }

  async findProjectsByUserId(userId: string) {
    const ids = await this.findProjectIdsByUserId(userId);
    const projects = await Promise.all(
      ids.map((id) =>
        this.projectRepo.findOneBy({ id: toObjectId(id) } as any),
      ),
    );
    return projects.filter(Boolean) as Project[];
  }

  async isUserAssociated(userId: string, projectId: string) {
    const p = await this.repo.findOneBy({ userId, projectId } as any);
    return !!p;
  }
}
