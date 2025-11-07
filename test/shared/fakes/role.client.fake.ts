import { Role } from '../../../src/module/tickets/domain/models/role.entity';
import { UserRole } from '../../../src/module/tickets/domain/models/user-role.entity';

export const fakeClientRole = new Role();
fakeClientRole.name = 'client';

export const fakeClientUserRole = (userId: string) => {
  const ur = UserRole.create(userId, fakeClientRole);
  return ur;
};
