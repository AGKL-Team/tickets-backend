import { Role } from '../models/role.entity';

export interface RoleRepository {
  create(entity: Role): Promise<Role>;
  findById(id: string): Promise<Role>;
  findAll(): Promise<Role[]>;
  update(entity: Role): Promise<Role>;
  delete(id: string): Promise<void>;
}
