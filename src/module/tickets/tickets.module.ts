import { Module } from '@nestjs/common';
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
  ProjectController,
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
import { CreateProject } from './application/useCases/create-project.use-case';
import { CreateRating } from './application/useCases/create-rating.use-case';
import { CreateSubArea } from './application/useCases/create-sub-area.use-case';
import { DeleteArea } from './application/useCases/delete-area.use-case';
import { DeleteClaimCategory } from './application/useCases/delete-claim-category.use-case';
import { DeleteComment } from './application/useCases/delete-comment.use-case';
import { DeletePriority } from './application/useCases/delete-priority.use-case';
import { DeleteProject } from './application/useCases/delete-project.use-case';
import { DeleteRating } from './application/useCases/delete-rating.use-case';
import { DeleteSubArea } from './application/useCases/delete-sub-area.use-case';
import { TransferArea } from './application/useCases/transfer-area.use-case';
import { UpdateArea } from './application/useCases/update-area.use-case';
import { UpdateClaimCategory } from './application/useCases/update-claim-category.use-case';
import { UpdateClaim } from './application/useCases/update-claim.use-case';
import { UpdateComment } from './application/useCases/update-comment.use-case';
import { UpdatePriority } from './application/useCases/update-priority.use-case';
import { UpdateProject } from './application/useCases/update-project.use-case';
import { UpdateRating } from './application/useCases/update-rating.use-case';
import { UpdateSubArea } from './application/useCases/update-sub-area.use-case';
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
  UserProjectService,
  UserRoleService,
} from './infrastructure/services';

@Module({
  imports: [DatabaseModule, AuthModule],
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
    UserProjectService,
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
    // Project use-cases
    CreateProject,
    UpdateProject,
    DeleteProject,
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
    // Project use-cases
    CreateProject,
    UpdateProject,
    DeleteProject,
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
    ProjectController,
    // new controllers
    CommentController,
    RatingController,
    AssignmentController,
  ],
})
export class TicketModule {}
