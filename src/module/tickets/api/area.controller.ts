import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  Roles,
  RolesGuard,
  SupabaseAuthGuard,
} from '../../core/auth/infrastructure/guard';
import { CreateAreaDto } from '../application/dto/create-area.dto';
import { UpdateAreaDto } from '../application/dto/update-area.dto';
import { CreateArea } from '../application/useCases/create-area.use-case';
import { UpdateArea } from '../application/useCases/update-area.use-case';
import { AreaService } from '../infrastructure/services/area.service';

@UseGuards(SupabaseAuthGuard, RolesGuard)
@Controller('areas')
export class AreaController {
  constructor(
    private readonly service: AreaService,
    private readonly createArea: CreateArea,
    private readonly updateArea: UpdateArea,
  ) {}

  @Post()
  @Roles('admin')
  async create(@Body(ValidationPipe) request: CreateAreaDto) {
    return await this.createArea.execute(request);
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
  async update(@Param('id') id: string, @Body() request: UpdateAreaDto) {
    return await this.updateArea.execute(id, request);
  }

  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: string) {
    await this.service.delete(id);
    return { deleted: true };
  }
}
