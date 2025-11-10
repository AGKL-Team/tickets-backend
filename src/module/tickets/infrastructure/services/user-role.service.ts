import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { toObjectId } from '../../../core/database/mongo.utils';
import { UserRole } from '../../domain/models/user-role.entity';
import { UserRoleRepository } from '../../domain/repositories/user-role.repository.interface';

@Injectable()
export class UserRoleService implements UserRoleRepository {
  constructor(
    @InjectRepository(UserRole)
    private readonly repo: MongoRepository<UserRole>,
  ) {}

  async create(entity: UserRole): Promise<UserRole> {
    return this.repo.save(entity as any);
  }

  async findById(id: string): Promise<UserRole> {
    const r = await this.repo.findOneBy({ id: toObjectId(id) } as any);
    if (!r)
      throw new NotFoundException(`No se encuentra userRole con ID ${id}`);
    return r;
  }

  async findByUserId(userId: string): Promise<UserRole[]> {
    return this.repo.find({ where: { userId } as any } as any);
  }

  async findAll(): Promise<UserRole[]> {
    return this.repo.find();
  }

  async update(entity: UserRole): Promise<UserRole> {
    return this.repo.save(entity as any);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id as any);
  }
}
