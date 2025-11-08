import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  private readonly logger = new Logger(FirebaseService.name);
  private initialized = false;

  constructor(private readonly configService: ConfigService) {
    this.initFirebase();
  }

  private initFirebase() {
    if (this.initialized) return;

    // Try service account JSON from environment variable first (FIREBASE_SERVICE_ACCOUNT)
    const saJson = process.env.FIREBASE_SERVICE_ACCOUNT;
    const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

    try {
      if (saJson) {
        const parsed = JSON.parse(saJson);
        admin.initializeApp({ credential: admin.credential.cert(parsed) });
        this.logger.log(
          'Initialized Firebase Admin using FIREBASE_SERVICE_ACCOUNT',
        );
      } else if (credPath) {
        admin.initializeApp({
          credential: admin.credential.applicationDefault(),
        });
        this.logger.log(
          'Initialized Firebase Admin using application default credentials',
        );
      } else {
        // No credentials provided; initialize default app (useful for tests where services are mocked)
        try {
          admin.initializeApp();
          this.logger.log(
            'Initialized Firebase Admin default app (no credentials provided)',
          );
        } catch (e) {
          this.logger.warn(
            'Could not initialize Firebase Admin default app; continuing without a client',
            e,
          );
        }
      }
    } catch (e) {
      this.logger.error('Firebase initialization failed', e);
      // don't throw here to avoid breaking test environment; specific callers should handle missing client
    }

    this.initialized = true;
  }

  /**
   * Returns the Firestore client if available.
   */
  getClient() {
    try {
      return admin.firestore();
    } catch (err) {
      this.logger.warn('Firestore client unavailable', err as any);
      return undefined;
    }
  }

  /**
   * Verifies an authentication token (Firebase ID token) and returns
   * a user-like object { user } to keep compatibility with code that
   * originally expected Supabase's `auth.getUser` result shape.
   */
  async getUserFromToken(token: string) {
    if (!token) return { user: null };
    try {
      const decoded = await admin.auth().verifyIdToken(token);
      const uid = decoded.uid || decoded.sub || decoded.user_id;
      if (!uid) return { user: null };
      const userRecord = await admin.auth().getUser(uid);
      return { user: userRecord };
    } catch (e) {
      this.logger.warn('Token verification failed', e);
      return { user: null };
    }
  }

  async getUserByEmail(email: string) {
    try {
      const user = await admin.auth().getUserByEmail(email);
      return user;
    } catch (e) {
      void e;
      return null;
    }
  }

  async createUser(email: string, password: string) {
    try {
      const user = await admin.auth().createUser({ email, password });
      return user;
    } catch (e) {
      this.logger.warn('Create user failed', e);
      throw e;
    }
  }

  handleError(error: any) {
    // Map some common Firebase Admin errors to user-friendly messages.
    const code = error?.code || error?.message || '';

    // Supabase-style codes (kept for test compatibility)
    if (code === 'user_already_exists')
      throw new BadRequestException('El usuario ya existe');
    if (code === 'invalid_email')
      throw new BadRequestException('El correo electrónico no es válido');
    if (code === 'invalid_password')
      throw new BadRequestException('La contraseña no es válida');
    if (code === 'invalid_credentials')
      throw new BadRequestException('Las credenciales son inválidas');

    // Map some common Firebase Admin errors to user-friendly messages.
    if (typeof code === 'string') {
      if (code.includes('auth/')) {
        if (code.includes('invalid-email'))
          throw new BadRequestException('El correo electrónico no es válido');
        if (code.includes('email-already-exists'))
          throw new BadRequestException('El usuario ya existe');
        if (code.includes('invalid-password') || code.includes('weak-password'))
          throw new BadRequestException('La contraseña no es válida');
        if (code.includes('invalid-credential'))
          throw new BadRequestException('Las credenciales son inválidas');
      }
    }

    // Fallback: include the original code/text when available to aid tests that
    // assert on the exact message
    // Log safely: some logger implementations may attempt to access properties
    // on the error object; stringify to avoid runtime exceptions during tests.
    // Avoid complex logging here to prevent test-time issues with logger
    // implementations. We intentionally skip detailed logging for unknown
    // errors and only include the code in the thrown message.
    const suffix = typeof code === 'string' && code ? String(code) : '';
    throw new BadRequestException(
      `Ocurrió un error inesperado. Inténtalo de nuevo más tarde.${suffix}`,
    );
  }
}
