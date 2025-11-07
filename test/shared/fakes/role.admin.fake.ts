import { Role } from '../../../src/module/tickets/domain/models/role.entity';
import { UserRole } from '../../../src/module/tickets/domain/models/user-role.entity';

export const fakeAdminRole = new Role();
fakeAdminRole.name = 'admin';

export const fakeAdminUserRole = (userId: string) => {
  const ur = UserRole.create(userId, fakeAdminRole);
  return ur;
};
