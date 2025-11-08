import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { User } from '@supabase/supabase-js';
import { UserFromRequest } from '../../core/auth/infrastructure/decorators/user.decorator';
import {
  FirebaseAuthGuard,
  Roles,
  RolesGuard,
} from '../../core/auth/infrastructure/guard';
import { AssignResolverDto } from '../application/dto/assign-resolver.dto';
import { AssignSubAreaDto } from '../application/dto/assign-subarea.dto';
import { TransferAreaDto } from '../application/dto/transfer-area.dto';
import { AssignResolver } from '../application/useCases/assign-resolver.use-case';
import { AssignSubArea } from '../application/useCases/assign-subarea.use-case';
import { TransferArea } from '../application/useCases/transfer-area.use-case';

@UseGuards(FirebaseAuthGuard, RolesGuard)
@Controller('claims')
export class AssignmentController {
  constructor(
    private readonly assignResolverUseCase: AssignResolver,
    private readonly assignSubAreaUseCase: AssignSubArea,
    private readonly transferAreaUseCase: TransferArea,
  ) {}

  @Post(':id/assign-resolver')
  @Roles('area_manager', 'admin')
  async assignResolver(
    @Param('id') claimId: string,
    @Body() body: AssignResolverDto,
    @UserFromRequest() user: User,
  ) {
    return this.assignResolverUseCase.execute(
      claimId,
      body.resolverId,
      user.id,
    );
  }

  @Post(':id/assign-subarea')
  @Roles('area_manager', 'admin')
  async assignSubArea(
    @Param('id') claimId: string,
    @Body() body: AssignSubAreaDto,
    @UserFromRequest() user: User,
  ) {
    return this.assignSubAreaUseCase.execute(claimId, body.subAreaId, user.id);
  }

  @Post(':id/transfer-area')
  @Roles('area_manager', 'admin')
  async transferArea(
    @Param('id') claimId: string,
    @Body() body: TransferAreaDto,
    @UserFromRequest() user: User,
  ) {
    return this.transferAreaUseCase.execute(claimId, body.areaId, user.id);
  }
}
