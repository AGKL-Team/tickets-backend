import { BadRequestException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { SignInRequest } from '../../src/module/core/auth/application/requests/sign-in-request';
import { SignUpRequest } from '../../src/module/core/auth/application/requests/sign-up-request';
import { AuthService } from '../../src/module/core/auth/infrastructure/services/auth.service';
import { SupabaseService } from '../../src/module/core/database/services/supabase.service';
import { ConfigTestProvider } from '../shared/providers/config-test.provider';

describe('AuthService', () => {
  let service: AuthService;

  // Definir fuera del beforeEach para mantener la referencia
  const supabaseClient = {
    rpc: jest.fn(),
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      ensureUserNotExists: jest.fn(),
    },
  };
  const supabaseService = {
    getClient: jest.fn().mockReturnValue(supabaseClient),
    handleError: jest.fn(),
  } as any;

  beforeEach(async () => {
    // Limpiar mocks antes de cada test
    supabaseClient.rpc.mockReset();
    supabaseClient.auth.signUp.mockReset();
    supabaseClient.auth.signInWithPassword.mockReset();
    supabaseClient.auth.signOut.mockReset();
    supabaseService.getClient.mockClear();

    const module = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        AuthService,
        { provide: SupabaseService, useValue: supabaseService },
        ConfigTestProvider,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  // ======= SIGN UP =======
  it('should sign up a new user successfully', async () => {
    // Arrange
    const request: SignUpRequest = {
      email: 'test@test.com',
      password: '123456',
      confirmPassword: '123456',
    };
    const queryResult = {
      data: null,
      error: null,
    };
    supabaseClient.rpc.mockResolvedValue(queryResult);
    supabaseClient.auth.signUp.mockResolvedValue({
      data: {
        user: {
          id: 'new-user-id',
          email: 'test@test.com',
        },
      },
      error: null,
    });

    // Act
    await service.signUp(request);

    // Assert
    expect(supabaseClient.rpc).toHaveBeenCalled();
    expect(supabaseClient.auth.signUp).toHaveBeenCalledWith({
      email: request.email,
      password: request.password,
    });
  });

  it('should throw if user already exists', async () => {
    // Arrange
    const queryResult = {
      data: [{ id: 'existing-user-id' }],
      error: null,
    };
    supabaseClient.rpc.mockResolvedValue(queryResult);

    // Assert
    await expect(
      service.signUp({
        email: 'exists@test.com',
        password: '123456',
        confirmPassword: '123456',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw if signUp fails', async () => {
    supabaseClient.rpc.mockResolvedValue({ data: null, error: 'some-error' });
    supabaseClient.auth.signUp.mockResolvedValue({ error: 'fail' });
    jest.spyOn(supabaseService, 'handleError').mockImplementation(() => {
      throw new BadRequestException(
        'Ocurrió un error inesperado. Inténtalo de nuevo más tarde.',
      );
    });

    await expect(
      service.signUp({
        email: 'test@test.com',
        password: '123456',
        confirmPassword: '123456',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  // ======= SIGN IN =======
  it('should sign in a user successfully', async () => {
    supabaseClient.auth.signInWithPassword.mockResolvedValue({
      data: {
        session: {
          access_token: 'token',
          expires_in: 3600,
        },
        user: {
          email: 'test@test.com',
        },
      },
      error: null,
    });

    const request: SignInRequest = {
      email: 'test@test.com',
      password: '123456',
    };
    const result = await service.signIn(request);

    expect(result).toEqual({
      access_token: 'token',
      expires_in: 3600,
      email: request.email,
    });
    expect(supabaseClient.auth.signInWithPassword).toHaveBeenCalledWith(
      request,
    );
  });

  it('should throw if signIn fails', async () => {
    supabaseClient.auth.signInWithPassword.mockResolvedValue({ error: 'fail' });

    await expect(
      service.signIn({ email: 'test@test.com', password: 'wrong' }),
    ).rejects.toThrow(BadRequestException);
  });

  // ======= SIGN OUT =======
  it('should sign out successfully', async () => {
    supabaseClient.auth.signOut.mockResolvedValue({ error: null });

    const result = await service.signOut();

    expect(result).toEqual({ error: null });
    expect(supabaseClient.auth.signOut).toHaveBeenCalledWith({
      scope: 'global',
    });
  });

  it('should throw if signOut fails', async () => {
    supabaseClient.auth.signOut.mockResolvedValue({ error: 'some error' });

    await expect(service.signOut()).rejects.toThrow(BadRequestException);
  });
});
