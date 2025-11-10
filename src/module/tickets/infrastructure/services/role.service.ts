import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../domain/models/role.entity';
import { RoleRepository } from '../../domain/repositories/role.repository.interface';

@Injectable()
export class RoleService implements RoleRepository {
  constructor(
    @InjectRepository(Role)
    private readonly repo: Repository<Role>,
  ) {}

  async create(entity: Role): Promise<Role> {
    return this.repo.save(entity as any);
  }

  async findById(id: string): Promise<Role> {
    const r = await this.repo.findOneBy({ id } as any);
    if (!r) throw new NotFoundException(`No se encuentra el rol con ID ${id}`);
    return r;
  }

  async findAll(): Promise<Role[]> {
    return this.repo.find();
  }

  async update(entity: Role): Promise<Role> {
    return this.repo.save(entity as any);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id as any);
  }
}
