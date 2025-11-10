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
import { User } from '@supabase/supabase-js';
import { UserFromRequest } from '../../core/auth/infrastructure/decorators/user.decorator';
import { Roles, RolesGuard } from '../../core/auth/infrastructure/guard';
import { SupabaseAuthGuard } from '../../core/auth/infrastructure/guard/supabase-auth.guard';
import { CreateClaimDto } from '../application/dto/create-claim.dto';
import { UpdateClaimDto } from '../application/dto/update-claim.dto';
import { CreateClaim } from '../application/useCases/create-claim.use-case';
import { UpdateClaim } from '../application/useCases/update-claim.use-case';
import { ClaimService } from '../infrastructure/services/claim.service';

@UseGuards(SupabaseAuthGuard, RolesGuard)
@Controller('claims')
export class ClaimController {
  constructor(
    private readonly service: ClaimService,
    private readonly createClaim: CreateClaim,
    private readonly updateClaim: UpdateClaim,
  ) {}

  @Post()
  @Roles('client')
  async create(@Body() request: CreateClaimDto, @UserFromRequest() user: User) {
    return await this.createClaim.execute(request, user.id);
  }

  @Get()
  async findAll(@UserFromRequest() user: User) {
    return this.service.findAll(user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @UserFromRequest() user: User) {
    return this.service.findById(id, user.id);
  }

  @Put(':id')
  @Roles('client')
  async update(
    @Param('id') id: string,
    @Body() request: UpdateClaimDto,
    @UserFromRequest() user: User,
  ) {
    return await this.updateClaim.execute(id, request, user.id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.service.delete(id);
    return { deleted: true };
  }
}
