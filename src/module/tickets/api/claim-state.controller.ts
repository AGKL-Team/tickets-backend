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
import { FirebaseAuthGuard } from '../../core/auth/infrastructure/guard/firebase-auth.guard';
import { ClaimState } from '../domain/models/claim-state.entity';
import { ClaimStateService } from '../infrastructure/services/claim-state.service';

@UseGuards(FirebaseAuthGuard)
@Controller('claim-states')
export class ClaimStateController {
  constructor(private readonly service: ClaimStateService) {}

  @Post()
  @Roles('admin')
  async create(@Body() request: Partial<ClaimState>) {
    return this.service.create(request as ClaimState);
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
  async update(@Param('id') id: string, @Body() body: Partial<ClaimState>) {
    const existing = await this.service.findById(id);
    if (!existing) return null;
    const updated = Object.assign(existing, body);
    return this.service.update(updated as ClaimState);
  }

  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: string) {
    await this.service.delete(id);
    return { deleted: true };
  }
}
