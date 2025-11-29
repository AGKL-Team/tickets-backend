import {
  BadRequestException,
  Injectable,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@supabase/supabase-js';
import { MongoRepository } from 'typeorm';
import { AuthService } from '../../../core/auth/infrastructure/services/auth.service';
import { Role } from '../../domain/models';
import { UserRole } from '../../domain/models';
import { UserRoleRepository } from '../../domain/repositories';
import { RoleService } from './role.service';

@Injectable()
export class UserRoleService implements UserRoleRepository {
  constructor(
    @InjectRepository(UserRole, 'mongoConnection')
    private readonly userRoleRepository: MongoRepository<UserRole>,

    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    private readonly roleService: RoleService,
  ) {}

  async create(entity: UserRole): Promise<UserRole> {
    return await this.userRoleRepository.save(entity);
  }

  async findById(id: string): Promise<UserRole> {
    const userRole = await this.userRoleRepository.findOneBy({ id });
    if (!userRole)
      throw new BadRequestException(
        `No se encuentra el rol de usuario con ID ${id}`,
      );
    return userRole;
  }

  async findByUserId(userId: string): Promise<UserRole[]> {
    return await this.userRoleRepository.find({
      where: {
        userId: userId,
      },
    });
  }

  async findAll(): Promise<UserRole[]> {
    return await this.userRoleRepository.find();
  }

  async update(entity: UserRole): Promise<UserRole> {
    return await this.userRoleRepository.save(entity);
  }

  async updateUserRole(userId: string, newRoleId: string): Promise<void> {
    await this.userRoleRepository.delete({ userId });

    const newUserRole = new UserRole();
    newUserRole.userId = userId;
    newUserRole.roleId = newRoleId;

    await this.userRoleRepository.save(newUserRole);
  }

  async delete(id: string): Promise<void> {
    await this.userRoleRepository.delete(id);
  }

  async findClients(): Promise<User[]> {
    const role = await this.roleService.findByName(Role.CLIENT);
    const clients = await this.userRoleRepository.find({
      where: {
        roleId: role.id,
      },
    });

    const users: User[] = [];
    for (const client of clients) {
      const user = await this.authService.findById(client.userId);
      if (user) users.push(user);
    }

    return users;
  }
}