import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../../../core/database/services/supabase.service';
import { UserRoleService } from './user-role.service';
import { RoleService } from './role.service';
import { UpdateUserProfileDto } from '../../application/dto/update-user-profile.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly userRoleService: UserRoleService,
    private readonly roleService: RoleService,
  ) {}

  private get supabaseAdmin() {
    return this.supabaseService.getClient().auth.admin;
  }

  async findOne(userId: string) {
    const { data, error } = await this.supabaseAdmin.getUserById(userId);

    if (error || !data || !data.user) {
      throw new NotFoundException('Usuario no encontrado en Auth');
    }

    const user = data.user;
    const userRoles = await this.userRoleService.findByUserId(userId);

    let roleName = 'user';

    if (userRoles && userRoles.length > 0) {
      try {
        const role = await this.roleService.findById(userRoles[0]!.roleId);
        if (role) roleName = role.name;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) { /* empty */ }
    }

    return {
      id: user.id,
      nombre: user.user_metadata?.nombre || '',
      email: user.email,
      telefono: user.user_metadata?.telefono || '',
      role: roleName
    };
  }

  async updateProfile(userId: string, dto: UpdateUserProfileDto) {
    const { data, error } = await this.supabaseAdmin.updateUserById(userId, {
      user_metadata: {
        nombre: dto.nombre,
      }
    });

    if (error) throw new InternalServerErrorException('Error actualizando perfil');
    return data?.user;
  }

  async findAll() {
    const { data, error } = await this.supabaseAdmin.listUsers();

    if (error) throw new InternalServerErrorException(error.message);

    const usersList = data?.users || [];

    const result = await Promise.all(usersList.map(async (u) => {
      const userRoles = await this.userRoleService.findByUserId(u.id);
      let roleName = 'user';

      if (userRoles && userRoles.length > 0) {
        try {
          const role = await this.roleService.findById(userRoles[0]!.roleId);
          if (role) roleName = role.name;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) { /* empty */ }
      }

      return {
        id: u.id,
        username: u.user_metadata?.nombre || u.email,
        ultimoInicio: u.last_sign_in_at,
        roles: roleName
      };
    }));

    return result;
  }

  async updateRole(userId: string, roleId: string) {
    await this.userRoleService.updateUserRole(userId, roleId);
    return { message: 'Rol actualizado correctamente' };
  }

  async remove(userId: string) {
    const { error } = await this.supabaseAdmin.deleteUser(userId);
    if (error) throw new InternalServerErrorException('Error eliminando de Supabase');
    return { message: 'Usuario eliminado' };
  }
}