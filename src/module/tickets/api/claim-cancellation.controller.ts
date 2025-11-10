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
import { ClaimCancellation } from '../domain/models/claim-cancellation.entity';
import { ClaimCancellationService } from '../infrastructure/services/claim-cancellation.service';

@UseGuards(SupabaseAuthGuard)
@Controller('claim-cancellations')
export class ClaimCancellationController {
  constructor(private readonly service: ClaimCancellationService) {}

  @Post()
  async create(@Body() body: Partial<ClaimCancellation>) {
    return this.service.create(body as ClaimCancellation);
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
  async update(
    @Param('id') id: string,
    @Body() body: Partial<ClaimCancellation>,
  ) {
    const existing = await this.service.findById(id);
    if (!existing) return null;
    const updated = Object.assign(existing, body);
    return this.service.update(updated as ClaimCancellation);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.service.delete(id);
    return { deleted: true };
  }
}
