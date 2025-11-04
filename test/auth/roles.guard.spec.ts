import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from '../../src/module/core/auth/infrastructure/guard/roles.guard';
import { UserRoleService } from '../../src/module/tickets/infrastructure/services/user-role.service';
import { fakeAdminUser } from '../shared/fakes/user.admin.fake';
import { fakeClientUser } from '../shared/fakes/user.client.fake';
import { fakeApplicationUser } from '../shared/fakes/user.fake';

function createExecutionContext(
  request: any,
  handler?: any,
  cls?: any,
): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
    getHandler: () => handler ?? (() => {}),
    getClass: () => cls ?? function () {},
  } as unknown as ExecutionContext;
}

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: jest.Mocked<Reflector>;
  let userRoleService: Partial<UserRoleService>;

  beforeEach(() => {
    jest.clearAllMocks();
    reflector = {
      getAllAndOverride: jest.fn(),
    } as unknown as jest.Mocked<Reflector>;

    userRoleService = {
      findByUserId: jest.fn(),
    } as Partial<UserRoleService>;

    // construct with partial mocks
    guard = new RolesGuard(reflector as any, userRoleService as any);
  });

  it('allows when no required roles (no restriction)', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(undefined);
    const req = { headers: {}, user: fakeApplicationUser } as any;
    const ctx = createExecutionContext(req);

    await expect(guard.canActivate(ctx)).resolves.toBe(true);
  });

  it('allows when user has required role in DB', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['client']);
    const req = { headers: {}, user: fakeClientUser } as any;
    const ctx = createExecutionContext(req);

    (userRoleService.findByUserId as jest.Mock).mockResolvedValueOnce([
      {
        id: 'ur1',
        userId: fakeClientUser.id,
        role: { id: 'r1', name: 'client' },
      },
    ]);

    await expect(guard.canActivate(ctx)).resolves.toBe(true);
    expect(userRoleService.findByUserId).toHaveBeenCalledWith(
      fakeClientUser.id,
    );
  });

  it('throws ForbiddenException when userRoleService fails (DB error)', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['client']);
    const req = { headers: {}, user: fakeAdminUser } as any;
    const ctx = createExecutionContext(req);

    (userRoleService.findByUserId as jest.Mock).mockRejectedValueOnce(
      new Error('DB down'),
    );

    await expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException);
    expect(userRoleService.findByUserId).toHaveBeenCalledWith(fakeAdminUser.id);
  });

  it('throws ForbiddenException when user has no roles', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['admin']);
    const req = { headers: {}, user: { id: 'u-none' } } as any;
    const ctx = createExecutionContext(req);

    (userRoleService.findByUserId as jest.Mock).mockResolvedValueOnce([]);

    await expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException);
  });

  it('throws ForbiddenException when request has no user', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['client']);
    const req = { headers: {} } as any;
    const ctx = createExecutionContext(req);

    await expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException);
  });

  // TODO: Add tests for
  // - token contains non-array role formats (CSV/string)
  // - multiple required roles and matching any vs all semantics
  // - performance edge cases (large number of roles)
});
