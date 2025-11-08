import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseAuthGuard } from '../../src/module/core/auth/infrastructure/guard/supabase-auth.guard';
import { FirebaseService } from '../../src/module/core/database/services/firebase.service';

// ===== Helpers de mocks =====
function createExecutionContext(request: any): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as unknown as ExecutionContext;
}

function createMockSupabaseClient() {
  return {
    auth: {
      getUser: jest.fn(),
    },
  } as unknown as SupabaseClient;
}

describe('SupabaseAuthGuard', () => {
  let guard: SupabaseAuthGuard;
  let supabaseService: jest.Mocked<FirebaseService>;
  let supabaseClient: SupabaseClient;

  beforeEach(() => {
    jest.clearAllMocks();
    supabaseClient = createMockSupabaseClient();

    supabaseService = {
      getClient: jest.fn().mockReturnValue(supabaseClient),
      getUserFromToken: jest.fn(),
    } as unknown as jest.Mocked<FirebaseService>;

    // Instanciamos el guard con el service mockeado
    guard = new SupabaseAuthGuard(supabaseService);
  });

  it('debería pedir el cliente a SupabaseService en el constructor', () => {
    expect(supabaseService.getClient).toHaveBeenCalledTimes(1);
  });

  it('lanza Unauthorized si no hay Authorization header', async () => {
    const req = { headers: {} };
    const ctx = createExecutionContext(req);

    await expect(guard.canActivate(ctx)).rejects.toThrow(UnauthorizedException);
    await expect(guard.canActivate(ctx)).rejects.toThrow('No token provided');
  });

  it('lanza Unauthorized si el header tiene solo el esquema y no token (e.g. "Bearer")', async () => {
    const req = { headers: { authorization: 'Bearer' } };
    const ctx = createExecutionContext(req);

    await expect(guard.canActivate(ctx)).rejects.toThrow('No token provided');
  });

  it('lanza Unauthorized si hay espacios múltiples y no se extrae token (e.g. "Bearer    token")', async () => {
    // Con split(' ') el token en índice 1 podría ser '' y fallar
    const req = { headers: { authorization: 'Bearer     ' } };
    const ctx = createExecutionContext(req);

    await expect(guard.canActivate(ctx)).rejects.toThrow('No token provided');
  });

  it('lanza Unauthorized si Supabase retorna error', async () => {
    const req = { headers: { authorization: 'Bearer bad_token' } };
    const ctx = createExecutionContext(req);

    (supabaseService.getUserFromToken as jest.Mock).mockResolvedValueOnce({
      user: null,
    });

    await expect(guard.canActivate(ctx)).rejects.toThrow(
      'Invalid or expired token',
    );
    expect(supabaseService.getUserFromToken).toHaveBeenCalledWith('bad_token');
  });

  it('lanza Unauthorized si data.user es null/undefined', async () => {
    const req = { headers: { authorization: 'Bearer expired_token' } };
    const ctx = createExecutionContext(req);

    (supabaseService.getUserFromToken as jest.Mock).mockResolvedValueOnce({
      user: null,
    });

    await expect(guard.canActivate(ctx)).rejects.toThrow(
      'Invalid or expired token',
    );
    expect(supabaseService.getUserFromToken).toHaveBeenCalledWith(
      'expired_token',
    );
  });

  it('retorna true y adjunta request.user si el token es válido', async () => {
    const mockUser = { id: '123', email: 'a@b.com' };
    const req = { headers: { authorization: 'Bearer good_token' } } as any;
    const ctx = createExecutionContext(req);

    (supabaseService.getUserFromToken as jest.Mock).mockResolvedValueOnce({
      user: mockUser,
    });

    await expect(guard.canActivate(ctx)).resolves.toBe(true);
    expect(req.user).toEqual(mockUser);
    expect(supabaseService.getUserFromToken).toHaveBeenCalledWith('good_token');
  });

  it('acepta esquemas no-Bearer (comportamiento actual) porque solo extrae la segunda parte', async () => {
    // Nota: tu implementación actual no valida el esquema "Bearer"
    const mockUser = { id: 'u1' };
    const req = { headers: { authorization: 'Token xyz' } } as any;
    const ctx = createExecutionContext(req);

    (supabaseService.getUserFromToken as jest.Mock).mockResolvedValueOnce({
      user: mockUser,
    });

    await expect(guard.canActivate(ctx)).resolves.toBe(true);
    expect(req.user).toEqual(mockUser);
    expect(supabaseService.getUserFromToken).toHaveBeenCalledWith('xyz');
  });
});
