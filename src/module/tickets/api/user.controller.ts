import { Controller, Get, Patch, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { UserService } from '../infrastructure/services/user.service';
import { UpdateUserProfileDto } from '../application/dto/update-user-profile.dto';
import { UpdateUserRoleDto } from '../application/dto/update-user-role.dto';
import { SupabaseAuthGuard } from '../../core/auth/infrastructure/guard';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {}

  @Get('profile')
  @UseGuards(SupabaseAuthGuard)
  async getProfile(@Request() req: any) {
    const userId = req.user.sub || req.user.id;
    return this.userService.findOne(userId);
  }

  @Patch('profile')
  @UseGuards(SupabaseAuthGuard)
  async updateProfile(@Request() req: any, @Body() dto: UpdateUserProfileDto) {
    const userId = req.user.sub || req.user.id;
    return this.userService.updateProfile(userId, dto);
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Patch(':id/role')
  async updateRole(@Param('id') id: string, @Body() dto: UpdateUserRoleDto) {
    if (dto.roleId) {
      return this.userService.updateRole(id, dto.roleId);
    }
    return { message: 'No se proporcionó roleId' };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}