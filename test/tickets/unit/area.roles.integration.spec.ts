import { Reflector } from '@nestjs/core';
import { RolesGuard } from '../../../src/module/core/auth/infrastructure/guard/roles.guard';
import { AreaController } from '../../../src/module/tickets/api/area.controller';
import { UserRoleService } from '../../../src/module/tickets/infrastructure/services/user-role.service';
import { adminUserRole, clientUserRole } from '../../shared/helpers/role-fakes';

function createExecutionContext(req: any, handler?: any, cls?: any) {
  return {
    switchToHttp: () => ({ getRequest: () => req }),
    getHandler: () => handler ?? (() => {}),
    getClass: () => cls ?? function () {},
  } as any;
}

describe('AreaController Roles integration', () => {
  let guard: RolesGuard;
  let userRoleService: Partial<UserRoleService>;

  beforeEach(() => {
    userRoleService = { findByUserId: jest.fn() } as any;
    guard = new RolesGuard(new Reflector(), userRoleService as any);
  });

  it('allows access to create for admin user', async () => {
    const req = { user: { id: 'u-admin' } } as any;
    (userRoleService.findByUserId as jest.Mock).mockResolvedValueOnce([
      adminUserRole('u-admin'),
    ] as any);

    const ctx = createExecutionContext(
      req,
      AreaController.prototype.create,
      AreaController,
    );
    await expect(guard.canActivate(ctx)).resolves.toBe(true);
  });

  it('denies access to create for non-admin user', async () => {
    const req = { user: { id: 'u-client' } } as any;
    (userRoleService.findByUserId as jest.Mock).mockResolvedValueOnce([
      clientUserRole('u-client'),
    ] as any);

    const ctx = createExecutionContext(
      req,
      AreaController.prototype.create,
      AreaController,
    );
    await expect(guard.canActivate(ctx)).rejects.toThrow();
  });
});
