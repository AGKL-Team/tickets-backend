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
import { Roles } from '../../core/auth/infrastructure/guard';
import { SupabaseAuthGuard } from '../../core/auth/infrastructure/guard/supabase-auth.guard';
import { CreatePriorityDto } from '../application/dto/create-priority.dto';
import { UpdatePriorityDto } from '../application/dto/update-priority.dto';
import { CreatePriority } from '../application/useCases/create-priority.use-case';
import { UpdatePriority } from '../application/useCases/update-priority.use-case';
import { PriorityService } from '../infrastructure/services/priority.service';

@UseGuards(SupabaseAuthGuard)
@Controller('priorities')
export class PriorityController {
  constructor(
    private readonly service: PriorityService,
    private readonly createPriority: CreatePriority,
    private readonly updatePriority: UpdatePriority,
  ) {}

  @Post()
  @Roles('admin')
  async create(@Body() request: CreatePriorityDto) {
    return this.createPriority.execute(request);
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
  @Roles('admin')
  async update(@Param('id') id: string, @Body() request: UpdatePriorityDto) {
    return await this.updatePriority.execute(id, request);
  }

  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: string) {
    await this.service.delete(id);
    return { deleted: true };
  }
}
