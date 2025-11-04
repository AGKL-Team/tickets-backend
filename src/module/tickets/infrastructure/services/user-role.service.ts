import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '../../domain/models/user-role.entity';
import { UserRoleRepository } from '../../domain/repositories/user-role.repository.interface';

@Injectable()
export class UserRoleService implements UserRoleRepository {
  constructor(
    @InjectRepository(UserRole)
    private readonly repo: Repository<UserRole>,
  ) {}

  async create(entity: UserRole): Promise<UserRole> {
    return this.repo.save(entity);
  }

  async findById(id: string): Promise<UserRole> {
    const ur = await this.repo.findOne({ where: { id } });
    if (!ur)
      throw new NotFoundException(
        `No se encuentra el rol de usuario con el ID ${id}`,
      );
    return ur;
  }

  async findByUserId(userId: string): Promise<UserRole[]> {
    return this.repo.find({
      where: { userId },
      relations: {
        role: true,
      },
    });
  }

  async findAll(): Promise<UserRole[]> {
    return this.repo.find();
  }

  async update(entity: UserRole): Promise<UserRole> {
    return this.repo.save(entity);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
