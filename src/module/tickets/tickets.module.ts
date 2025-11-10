import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './../core/auth/auth.module';
import { DatabaseModule } from './../core/database/database.module';
import {
  AreaController,
  AssignmentController,
  ClaimCancellationController,
  ClaimCategoryController,
  ClaimController,
  ClaimStateController,
  CommentController,
  PriorityController,
  RatingController,
  RoleController,
  SubAreaController,
} from './api';
import { AssignResolver } from './application/useCases/assign-resolver.use-case';
import { AssignSubArea } from './application/useCases/assign-subarea.use-case';
import { CreateArea } from './application/useCases/create-area.use-case';
import { CreateClaimCategory } from './application/useCases/create-claim-category.use-case';
import { CreateClaim } from './application/useCases/create-claim.use-case';
import { CreateComment } from './application/useCases/create-comment.use-case';
import { CreatePriority } from './application/useCases/create-priority.use-case';
import { CreateRating } from './application/useCases/create-rating.use-case';
import { CreateSubArea } from './application/useCases/create-sub-area.use-case';
import { DeleteArea } from './application/useCases/delete-area.use-case';
import { DeleteClaimCategory } from './application/useCases/delete-claim-category.use-case';
import { DeleteComment } from './application/useCases/delete-comment.use-case';
import { DeletePriority } from './application/useCases/delete-priority.use-case';
import { DeleteRating } from './application/useCases/delete-rating.use-case';
import { DeleteSubArea } from './application/useCases/delete-sub-area.use-case';
import { TransferArea } from './application/useCases/transfer-area.use-case';
import { UpdateArea } from './application/useCases/update-area.use-case';
import { UpdateClaimCategory } from './application/useCases/update-claim-category.use-case';
import { UpdateClaim } from './application/useCases/update-claim.use-case';
import { UpdateComment } from './application/useCases/update-comment.use-case';
import { UpdatePriority } from './application/useCases/update-priority.use-case';
import { UpdateRating } from './application/useCases/update-rating.use-case';
import { UpdateSubArea } from './application/useCases/update-sub-area.use-case';
import { Area } from './domain/models/area.entity';
import { ClaimCancellation } from './domain/models/claim-cancellation.entity';
import { ClaimCategory } from './domain/models/claim-category.entity';
import { ClaimComment } from './domain/models/claim-comment.entity';
import { ClaimCriticality } from './domain/models/claim-criticality.entity';
import { ClaimRating } from './domain/models/claim-rating.entity';
import { ClaimState } from './domain/models/claim-state.entity';
import { Claim } from './domain/models/claim.entity';
import { Priority } from './domain/models/priority.entity';
import { Project } from './domain/models/project.entity';
import { RatingCategory } from './domain/models/rating-category.entity';
import { Role } from './domain/models/role.entity';
import { SubArea } from './domain/models/sub-area.entity';
import { UserArea } from './domain/models/user-area.entity';
import { UserRole } from './domain/models/user-role.entity';
import {
  AreaService,
  ClaimCancellationService,
  ClaimCategoryService,
  ClaimCommentService,
  ClaimCriticalityService,
  ClaimRatingService,
  ClaimService,
  ClaimStateService,
  PriorityService,
  ProjectService,
  RatingCategoryService,
  RoleService,
  SubAreaService,
  UserAreaService,
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
      UserArea,
      Area,
      SubArea,
      ClaimCriticality,
      Project,
      ClaimComment,
      RatingCategory,
      ClaimRating,
    ]),
    DatabaseModule,
    AuthModule,
  ],
  providers: [
    // services
    ClaimService,
    ClaimCancellationService,
    ClaimCategoryService,
    ClaimCommentService,
    ClaimRatingService,
    ClaimStateService,
    PriorityService,
    RatingCategoryService,
    RoleService,
    UserRoleService,
    UserAreaService,
    AreaService,
    SubAreaService,
    ClaimCriticalityService,
    ProjectService,
    // Use cases
    // comments
    CreateComment,
    UpdateComment,
    DeleteComment,
    // ratings
    CreateRating,
    UpdateRating,
    DeleteRating,
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
    // new use-cases/controllers for comments, ratings, assignments
    // use-cases
    AssignResolver,
    AssignSubArea,
    TransferArea,
  ],
  exports: [
    ClaimService,
    ClaimCancellationService,
    ClaimCategoryService,
    ClaimCommentService,
    ClaimRatingService,
    ClaimStateService,
    PriorityService,
    RoleService,
    UserRoleService,
    UserAreaService,
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
    // exports for new use-cases/services
    CreateComment,
    UpdateComment,
    DeleteComment,
    CreateRating,
    UpdateRating,
    DeleteRating,
    AssignResolver,
    AssignSubArea,
    TransferArea,
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
    // new controllers
    CommentController,
    RatingController,
    AssignmentController,
  ],
})
export class TicketModule {}
