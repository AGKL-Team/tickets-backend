import { Role } from '../../../src/module/tickets/domain/models/role.entity';
import { UserRole } from '../../../src/module/tickets/domain/models/user-role.entity';

// Lightweight helpers to create Role and UserRole instances for tests.
// Use these to ensure domain helper methods (isAdmin, isAreaManager, isResolver)
// behave exactly like in production code.

function makeRole(name: string): Role {
  const r = new Role();
  r.name = name;
  return r;
}

function makeUserRole(userId: string, roleName: string): UserRole {
  const role = makeRole(roleName);
  return UserRole.create(userId, role);
}

export const adminUserRole = (userId: string) => makeUserRole(userId, 'admin');
export const clientUserRole = (userId: string) =>
  makeUserRole(userId, 'client');
export const areaManagerUserRole = (userId: string) =>
  makeUserRole(userId, 'area_manager');
export const resolverUserRole = (userId: string) =>
  makeUserRole(userId, 'resolver');

export const adminRole = () => makeRole('admin');
export const clientRole = () => makeRole('client');
export const areaManagerRole = () => makeRole('area_manager');
export const resolverRole = () => makeRole('resolver');
