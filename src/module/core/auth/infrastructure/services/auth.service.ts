import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { RoleService } from '../../../../tickets/infrastructure/services';
import { UserRoleService } from '../../../../tickets/infrastructure/services/user-role.service';
import { SupabaseService } from '../../../database/services/supabase.service';
import { SignInRequest } from '../../application/requests/sign-in-request';
import { SignUpRequest } from '../../application/requests/sign-up-request';
import { ApplicationUserResponse } from '../../application/responses/user-response.interface';

@Injectable()
export class AuthService {
  private readonly supabaseClient: SupabaseClient;

  constructor(
    private readonly supabaseService: SupabaseService,

    @Inject(forwardRef(() => UserRoleService))
    private readonly userRoleService: UserRoleService,

    @Inject(forwardRef(() => RoleService))
    private readonly roleService: RoleService,
  ) {
    this.supabaseClient = this.supabaseService.getClient();
  }

  /**
   * Sign Up a new user with email and password
   * @param credentials user credentials to sign up
   * @throws BadRequestException if there is an error during sign up
   */
  async signUp(credentials: SignUpRequest) {
    // ! Ensure the user not exists
    await this.ensureUserNotExists(credentials);

    // Create a new user with email and password
    const response = await this.supabaseClient.auth.signUp({
      email: credentials.email,
      password: credentials.password,
    });

    // ! If there is an error, throw a BadRequestException
    if (response.error) {
      this.supabaseService.handleError(response.error);
    }

    // ! If user is not created, throw a BadRequestException
    if (!response.data.user) {
      throw new BadRequestException(
        'Ocurrió un error mientras se creaba el usuario',
      );
    }
  }

  public async ensureUserNotExists(credentials: SignUpRequest) {
    const query = await this.supabaseClient.rpc('sql', {
      query: 'SELECT 1 FROM auth.users WHERE email = ?',
      params: [credentials.email],
    });

    // Ensure the query was successful
    const userExists = Boolean(query.data);

    if (userExists) {
      throw new BadRequestException('El usuario ya existe');
    }
  }

  /**
   * Sign In an existing user with email and password
   * @param credentials user credentials to sign in
   * @throws BadRequestException if there is an error during sign in
   */
  async signIn(credentials: SignInRequest) {
    // 1. Sign in the user with email and password
    const response =
      await this.supabaseClient.auth.signInWithPassword(credentials);

    // ! 2. If there is an error, throw a BadRequestException
    if (response.error) {
      this.supabaseService.handleError(response.error);
      return;
    }

    // 3. Return the access token and its expiration time and user info
    const user = response.data.user;

    // fetch user roles from DB to include in the login response (front needs them)
    let roles: string[] = [];
    try {
      console.log('Fetching user roles for user ID:', user.id);
      const userRoles = await this.userRoleService.findByUserId(user.id);
      console.log('Fetched user roles:', userRoles);
      // fetch roles
      for (const userRole of userRoles) {
        const role = await this.roleService.findById(userRole.roleId);
        if (role) roles.push(role.name);
      }
      console.info('User roles resolved:', roles);
    } catch (ex) {
      console.error('Error fetching user roles:', ex);
      // swallow errors and return empty roles if role lookup fails
      roles = [];
    }

    return {
      access_token: response.data.session.access_token,
      expires_in: response.data.session.expires_in,
      user: {
        id: user.id,
        email: user.email,
        user_metadata: user.user_metadata,
      },
      roles,
    } as ApplicationUserResponse;
  }

  /**
   * Sign Out the authenticated user
   * @returns
   */
  async signOut() {
    // Close all sessions for the authenticated user
    const response = await this.supabaseClient.auth.signOut({
      scope: 'global',
    });
    if (response.error) {
      throw new BadRequestException(response.error);
    }
    return response;
  }

  async me() {
    const user = this.supabaseClient.auth.getUser();
    try {
      const roles = await this.userRoleService.findAll();
      console.info('All roles:', roles);
    } catch (e) {
      console.warn('Could not fetch roles in me()', e);
    }

    return user;
  }

  async findById(userId: string) {
    const { data, error } =
      await this.supabaseClient.auth.admin.getUserById(userId);
    if (error) {
      throw new BadRequestException(error.message);
    }
    return data.user;
  }
}