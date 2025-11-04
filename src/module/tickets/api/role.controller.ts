import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { SupabaseAuthGuard } from '../../core/auth/infrastructure/guard/supabase-auth.guard';
import { Role } from '../domain/models/role.entity';
import { RoleService } from '../infrastructure/services/role.service';

@UseGuards(SupabaseAuthGuard)
@Controller('roles')
export class RoleController {
  constructor(private readonly service: RoleService) {}

  @Post()
  async create(@Body() body: Partial<Role>) {
    return this.service.create(body as Role);
  }

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: Partial<Role>) {
    const existing = await this.service.findById(id);
    if (!existing) return null;
    const updated = Object.assign(existing, body);
    return this.service.update(updated as Role);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.service.delete(id);
    return { deleted: true };
  }
}
