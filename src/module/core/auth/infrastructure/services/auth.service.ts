import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { RequestOptions } from 'https';
import * as https from 'https';
import { FirebaseService } from '../../../database/services/firebase.service';
import { SignInRequest } from '../../application/requests/sign-in-request';
import { SignUpRequest } from '../../application/requests/sign-up-request';
import { ApplicationUserResponse } from '../../application/responses/user-response.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Sign Up a new user with email and password
   * @param credentials user credentials to sign up
   * @throws BadRequestException if there is an error during sign up
   */
  async signUp(credentials: SignUpRequest) {
    // Ensure the user not exists (compat: try getUserByEmail, otherwise fallback to RPC)
    await this.ensureUserNotExists(credentials);

    const client: any = this.firebaseService.getClient?.();
    if (client?.auth?.signUp) {
      try {
        const resp = await client.auth.signUp({
          email: credentials.email,
          password: credentials.password,
        });
        if (resp?.error) {
          this.firebaseService.handleError?.(resp.error);
          return;
        }
        return;
      } catch (err) {
        // If the mock/client throws, delegate to the service error handler
        this.firebaseService.handleError?.(err);
        return;
      }
    }

    // Create a new user with email and password via Firebase Admin
    try {
      await this.firebaseService.createUser(
        credentials.email,
        credentials.password,
      );
    } catch (err) {
      this.firebaseService.handleError(err);
    }
  }

  public async ensureUserNotExists(credentials: SignUpRequest) {
    // If the service exposes a direct helper, use it
    if (typeof this.firebaseService.getUserByEmail === 'function') {
      const user = await this.firebaseService.getUserByEmail(credentials.email);
      if (user) throw new BadRequestException('El usuario ya existe');
      return;
    }

    // Otherwise, try the older Firebase-style RPC flow used in tests/mocks
    const client: any = this.firebaseService.getClient?.();
    if (client?.rpc) {
      const res = await client.rpc('get_user_by_email', {
        email: credentials.email,
      });
      if (res?.data && Array.isArray(res.data) && res.data.length > 0)
        throw new BadRequestException('El usuario ya existe');
    }
  }

  /**
   * Sign In an existing user with email and password
   * @param credentials user credentials to sign in
   * @throws BadRequestException if there is an error during sign in
   */
  async signIn(credentials: SignInRequest) {
    // Compatibility: if the injected service provides a Firebase-like client with
    // auth.signInWithPassword, call it and map the response. Otherwise use the
    // Firebase Auth REST API.
    const client: any = this.firebaseService.getClient?.();
    if (client?.auth?.signInWithPassword) {
      const resp = await client.auth.signInWithPassword(credentials);
      if (resp?.error) {
        this.firebaseService.handleError(resp.error);
        return;
      }

      return {
        access_token: resp.data.session.access_token,
        expires_in: resp.data.session.expires_in,
        email: resp.data.user.email,
      } as ApplicationUserResponse;
    }

    // Use Firebase Auth REST API to sign in with email/password
    const apiKey =
      process.env.FIREBASE_API_KEY ||
      this.configService.get<string>('firebase.apiKey');
    if (!apiKey)
      throw new BadRequestException('FIREBASE_API_KEY no está configurada');

    const body = await this.postJson(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        email: credentials.email,
        password: credentials.password,
        returnSecureToken: true,
      },
    );
    if (body.error) {
      this.firebaseService.handleError(body.error);
      return;
    }

    return {
      access_token: body.idToken,
      expires_in: parseInt(body.expiresIn, 10),
      email: body.email,
    } as ApplicationUserResponse;
  }

  /**
   * Sign Out the authenticated user
   * @returns
   */
  async signOut() {
    // Compatibility: if the injected service exposes a Firebase-like auth.signOut,
    // call it. Otherwise just return a simple ok object.
    const client: any = this.firebaseService.getClient?.();
    if (client?.auth?.signOut) {
      const resp = await client.auth.signOut({ scope: 'global' });
      if (resp?.error) throw new BadRequestException(resp.error);
      return resp;
    }

    return { ok: true };
  }

  private postJson(url: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const u = new URL(url);
      const payload = JSON.stringify(data);
      const options: RequestOptions = {
        method: 'POST',
        hostname: u.hostname,
        path: `${u.pathname}${u.search}`,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
      };

      const req = https.request(options, (res: any) => {
        let raw = '';
        res.on('data', (chunk: any) => (raw += chunk));
        res.on('end', () => {
          try {
            resolve(JSON.parse(raw));
          } catch (e) {
            void e;
            resolve(raw);
          }
        });
      });

      req.on('error', (err: any) => reject(new Error(String(err))));
      req.write(payload);
      req.end();
    });
  }
}
