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
import { Roles } from '../../core/auth/infrastructure/guard';
import { SupabaseAuthGuard } from '../../core/auth/infrastructure/guard/supabase-auth.guard';
import { CreateClaimCategoryDto } from '../application/dto/create-claim-category.dto';
import { UpdateClaimCategoryDto } from '../application/dto/update-claim-category.dto';
import { CreateClaimCategory } from '../application/useCases/create-claim-category.use-case';
import { UpdateClaimCategory } from '../application/useCases/update-claim-category.use-case';
import { ClaimCategoryService } from '../infrastructure/services/claim-category.service';

@UseGuards(SupabaseAuthGuard)
@Controller('claim-categories')
export class ClaimCategoryController {
  constructor(
    private readonly service: ClaimCategoryService,
    private readonly createClaimCategory: CreateClaimCategory,
    private readonly updateClaimCategory: UpdateClaimCategory,
  ) {}

  @Post()
  @Roles('admin')
  async create(@Body(ValidationPipe) request: CreateClaimCategoryDto) {
    return await this.createClaimCategory.execute(request);
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
  async update(
    @Param('id') id: string,
    @Body() request: UpdateClaimCategoryDto,
  ) {
    return await this.updateClaimCategory.execute(id, request);
  }

  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: string) {
    await this.service.delete(id);
    return { deleted: true };
  }
}
