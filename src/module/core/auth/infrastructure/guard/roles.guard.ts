import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRoleService } from '../../../../tickets/infrastructure/services/user-role.service';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: string[]) => {
  return (target: object, key?: any, descriptor?: any) => {
    Reflect.defineMetadata(
      ROLES_KEY,
      roles,
      descriptor ? descriptor.value : target,
    );
  };
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userRoleService: UserRoleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles || requiredRoles.length === 0) return true; // no role restriction

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) throw new ForbiddenException('User not found in request');

    // Roles are managed internally (DB). Query UserRoleService for this user.
    let userRolesArr: string[] = [];
    try {
      const userRoles = await this.userRoleService.findByUserId(user.id);
      if (userRoles && userRoles.length > 0) {
        userRolesArr = userRoles
          .map((ur: any) => ur.role?.name)
          .filter(Boolean);
      }
    } catch {
      // If DB/service fails, deny access (fail closed) to avoid granting permissions.
      throw new ForbiddenException('Unable to resolve user roles');
    }

    if (!userRolesArr || userRolesArr.length === 0) {
      throw new ForbiddenException('No roles available for user');
    }

    const has = requiredRoles.some((r) => userRolesArr.includes(r));
    if (!has)
      throw new ForbiddenException(
        'You do not have the required roles to access this resource',
      );
    return true;
  }
}
