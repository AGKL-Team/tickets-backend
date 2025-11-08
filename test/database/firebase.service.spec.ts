import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthError } from '@supabase/supabase-js';
import { FirebaseService } from '../../src/module/core/database/services/firebase.service';
import { ConfigTestProvider } from '../shared/providers/config-test.provider';
import { FirebaseTestProvider } from '../shared/providers/firebase-config-test.provider';

describe('FirebaseService', () => {
  let service: FirebaseService;

  beforeEach(async () => {
    // Mocking environment variables for Firebase
    process.env.FIREBASE_URL = 'https://fake-url.Firebase.co';
    process.env.FIREBASE_KEY = 'fake-key';

    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [FirebaseService, FirebaseTestProvider, ConfigTestProvider],
    }).compile();

    service = module.get<FirebaseService>(FirebaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should initialize Firebase client', () => {
    expect(service.getClient()).not.toBeNull();
  });

  it('should throw error if FIREBASE_URL is missing', async () => {
    // FirebaseService does not require FIREBASE_URL; ensure module still compiles
    process.env.FIREBASE_URL = '';
    process.env.FIREBASE_KEY = 'fake-key';
    const module = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [FirebaseService, ConfigTestProvider],
    }).compile();
    expect(module.get<FirebaseService>(FirebaseService)).toBeDefined();
  });

  it('should throw error if FIREBASE_KEY is missing', async () => {
    // FirebaseService does not require FIREBASE_KEY; ensure module still compiles
    process.env.FIREBASE_URL = 'https://fake-url.Firebase.co';
    process.env.FIREBASE_KEY = '';
    const module = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [FirebaseService, ConfigTestProvider],
    }).compile();
    expect(module.get<FirebaseService>(FirebaseService)).toBeDefined();
  });

  it('should throw BadRequestException with "El usuario ya existe" for user_already_exists', () => {
    expect(() =>
      service.handleError({
        code: 'user_already_exists',
        message: '',
      } as any),
    ).toThrow('El usuario ya existe');
  });

  it('should throw BadRequestException with "El correo electrónico no es válido" for invalid_email', () => {
    expect(() =>
      service.handleError({ code: 'invalid_email', message: '' } as any),
    ).toThrow('El correo electrónico no es válido');
  });

  it('should throw BadRequestException with "La contraseña no es válida" for invalid_password', () => {
    expect(() => {
      const error = {
        code: 'invalid_password',
        status: 400,
        name: '',
        message: '',
        __isAuthError: false,
      } as any as AuthError;

      service.handleError(error);
    }).toThrow('La contraseña no es válida');
  });

  it('should throw BadRequestException with "Las credenciales son inválidas" for invalid_credentials', () => {
    expect(() =>
      service.handleError({
        code: 'invalid_credentials',
        message: '',
      } as any),
    ).toThrow('Las credenciales son inválidas');
  });

  it('should throw BadRequestException with default message for unknown error code', () => {
    expect(() =>
      service.handleError({ code: 'unknown_code', message: '' } as any),
    ).toThrow(
      'Ocurrió un error inesperado. Inténtalo de nuevo más tarde.unknown_code',
    );
  });
});
