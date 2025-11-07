import { Role } from '../../../src/module/tickets/domain/models/role.entity';
import { UserRole } from '../../../src/module/tickets/domain/models/user-role.entity';

export const fakeResolverRole = new Role();
fakeResolverRole.name = 'resolver';

export const fakeResolverUserRole = (userId: string) => {
  const ur = UserRole.create(userId, fakeResolverRole);
  return ur;
};
