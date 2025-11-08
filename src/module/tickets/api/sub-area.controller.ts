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
  FirebaseAuthGuard,
  Roles,
  RolesGuard,
} from '../../core/auth/infrastructure/guard';
import { CreateSubAreaDto } from '../application/dto/create-sub-area.dto';
import { UpdateSubAreaDto } from '../application/dto/update-sub-area.dto';
import { CreateSubArea } from '../application/useCases/create-sub-area.use-case';
import { UpdateSubArea } from '../application/useCases/update-sub-area.use-case';
import { SubAreaService } from '../infrastructure/services/sub-area.service';

@UseGuards(FirebaseAuthGuard, RolesGuard)
@Controller('sub-areas')
export class SubAreaController {
  constructor(
    private readonly service: SubAreaService,
    private readonly createSubArea: CreateSubArea,
    private readonly updateSubArea: UpdateSubArea,
  ) {}

  @Post()
  @Roles('admin')
  async create(@Body(ValidationPipe) request: CreateSubAreaDto) {
    return await this.createSubArea.execute(request);
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
  async update(@Param('id') id: string, @Body() request: UpdateSubAreaDto) {
    return await this.updateSubArea.execute(id, request);
  }

  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: string) {
    await this.service.delete(id);
    return { deleted: true };
  }
}
