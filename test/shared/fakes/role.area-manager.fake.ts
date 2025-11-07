import { Role } from '../../../src/module/tickets/domain/models/role.entity';
import { UserRole } from '../../../src/module/tickets/domain/models/user-role.entity';

export const fakeAreaManagerRole = new Role();
fakeAreaManagerRole.name = 'area_manager';

export const fakeAreaManagerUserRole = (userId: string) => {
  const ur = UserRole.create(userId, fakeAreaManagerRole);
  return ur;
};
