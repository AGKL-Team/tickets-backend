import {
  BadRequestException,
  Injectable,
  NotImplementedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from '../../domain/models/user-role.entity';
import { UserRoleRepository } from '../../domain/repositories/user-role.repository.interface';
import { MongoRepository } from 'typeorm';

@Injectable()
export class UserRoleService implements UserRoleRepository {
  constructor(
    @InjectRepository(UserRole, 'mongoConnection')
    private readonly userRoleRepository: MongoRepository<UserRole>,
  ) {}

  create(entity: UserRole): Promise<UserRole> {
    console.error('Entity creation is not supported.', entity);
    throw new NotImplementedException('Entity creation is not supported.');
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

  update(entity: UserRole): Promise<UserRole> {
    console.error('Entity update is not supported.', entity);
    throw new NotImplementedException('Entity update is not supported.');
  }

  async delete(id: string): Promise<void> {
    await this.userRoleRepository.delete(id);
  }
}
