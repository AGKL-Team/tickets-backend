import { Reflector } from '@nestjs/core';
import { RolesGuard } from '../../../src/module/core/auth/infrastructure/guard/roles.guard';
import { SubAreaController } from '../../../src/module/tickets/api/sub-area.controller';
import { UserRoleService } from '../../../src/module/tickets/infrastructure/services/user-role.service';
import { adminUserRole, clientUserRole } from '../../shared/helpers/role-fakes';

function createExecutionContext(req: any, handler?: any, cls?: any) {
  return {
    switchToHttp: () => ({ getRequest: () => req }),
    getHandler: () => handler ?? (() => {}),
    getClass: () => cls ?? function () {},
  } as any;
}

describe('SubAreaController Roles integration', () => {
  let guard: RolesGuard;
  let userRoleService: Partial<UserRoleService>;

  beforeEach(() => {
    userRoleService = { findByUserId: jest.fn() } as any;
    guard = new RolesGuard(new Reflector(), userRoleService as any);
  });

  it('allows create for admin users', async () => {
    const req = { user: { id: 'u-admin' } } as any;
    (userRoleService.findByUserId as jest.Mock).mockResolvedValueOnce([
      adminUserRole('u-admin'),
    ] as any);

    const ctx = createExecutionContext(
      req,
      SubAreaController.prototype.create,
      SubAreaController,
    );
    await expect(guard.canActivate(ctx)).resolves.toBe(true);
  });

  it('denies create for non-admin users', async () => {
    const req = { user: { id: 'u-client' } } as any;
    (userRoleService.findByUserId as jest.Mock).mockResolvedValueOnce([
      clientUserRole('u-client'),
    ] as any);

    const ctx = createExecutionContext(
      req,
      SubAreaController.prototype.create,
      SubAreaController,
    );
    await expect(guard.canActivate(ctx)).rejects.toThrow();
  });
});
