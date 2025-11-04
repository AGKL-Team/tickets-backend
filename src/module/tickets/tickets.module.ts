import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './../core/auth/auth.module';
import { DatabaseModule } from './../core/database/database.module';
import {
  AreaController,
  ClaimCancellationController,
  ClaimCategoryController,
  ClaimController,
  ClaimStateController,
  PriorityController,
  RoleController,
  SubAreaController,
} from './api';
import { CreateArea } from './application/useCases/create-area.use-case';
import { CreateClaimCategory } from './application/useCases/create-claim-category.use-case';
import { CreateClaim } from './application/useCases/create-claim.use-case';
import { CreatePriority } from './application/useCases/create-priority.use-case';
import { CreateSubArea } from './application/useCases/create-sub-area.use-case';
import { DeleteArea } from './application/useCases/delete-area.use-case';
import { DeleteClaimCategory } from './application/useCases/delete-claim-category.use-case';
import { DeletePriority } from './application/useCases/delete-priority.use-case';
import { DeleteSubArea } from './application/useCases/delete-sub-area.use-case';
import { UpdateArea } from './application/useCases/update-area.use-case';
import { UpdateClaimCategory } from './application/useCases/update-claim-category.use-case';
import { UpdateClaim } from './application/useCases/update-claim.use-case';
import { UpdatePriority } from './application/useCases/update-priority.use-case';
import { UpdateSubArea } from './application/useCases/update-sub-area.use-case';
import {
  Area,
  Claim,
  ClaimCancellation,
  ClaimCategory,
  ClaimState,
  Priority,
  Role,
  SubArea,
  UserRole,
} from './domain/models';
import {
  AreaService,
  ClaimCancellationService,
  ClaimCategoryService,
  ClaimService,
  ClaimStateService,
  PriorityService,
  RoleService,
  SubAreaService,
  UserRoleService,
} from './infrastructure/services';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Claim,
      ClaimCancellation,
      ClaimCategory,
      ClaimState,
      Priority,
      Role,
      UserRole,
      Area,
      SubArea,
    ]),
    DatabaseModule,
    AuthModule,
  ],
  providers: [
    ClaimService,
    ClaimCancellationService,
    ClaimCategoryService,
    ClaimStateService,
    PriorityService,
    RoleService,
    UserRoleService,
    AreaService,
    SubAreaService,
    // Use cases
    CreateClaim,
    CreatePriority,
    UpdatePriority,
    UpdateClaim,
    CreateClaimCategory,
    UpdateClaimCategory,
    DeleteClaimCategory,
    DeletePriority,
    // Area/SubArea use-cases
    CreateArea,
    UpdateArea,
    DeleteArea,
    CreateSubArea,
    UpdateSubArea,
    DeleteSubArea,
  ],
  exports: [
    ClaimService,
    ClaimCancellationService,
    ClaimCategoryService,
    ClaimStateService,
    PriorityService,
    RoleService,
    UserRoleService,
    AreaService,
    SubAreaService,
    // Use cases
    CreateClaim,
    CreatePriority,
    UpdatePriority,
    UpdateClaim,
    CreateClaimCategory,
    UpdateClaimCategory,
    DeleteClaimCategory,
    DeletePriority,
    // Area/SubArea use-cases
    CreateArea,
    UpdateArea,
    DeleteArea,
    CreateSubArea,
    UpdateSubArea,
    DeleteSubArea,
  ],
  controllers: [
    ClaimController,
    PriorityController,
    ClaimCategoryController,
    ClaimStateController,
    RoleController,
    ClaimCancellationController,
    AreaController,
    SubAreaController,
  ],
})
export class TicketModule {}
