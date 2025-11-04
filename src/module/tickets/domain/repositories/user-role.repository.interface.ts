import { UserRole } from '../models/user-role.entity';

export interface UserRoleRepository {
  create(entity: UserRole): Promise<UserRole>;
  findById(id: string): Promise<UserRole>;
  findByUserId(userId: string): Promise<UserRole[]>;
  findAll(): Promise<UserRole[]>;
  update(entity: UserRole): Promise<UserRole>;
  delete(id: string): Promise<void>;
}
