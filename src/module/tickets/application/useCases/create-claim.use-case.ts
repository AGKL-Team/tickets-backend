import { Injectable } from '@nestjs/common';
import { Claim } from '../../domain/models';
import {
  AreaService,
  ClaimCategoryService,
  ClaimCriticalityService,
  ClaimService,
  PriorityService,
  ProjectService,
} from '../../infrastructure/services';
import { CreateClaimDto } from '../dto/create-claim.dto';

@Injectable()
export class CreateClaim {
  constructor(
    private readonly claimService: ClaimService,
    private readonly priorityService: PriorityService,
    private readonly categoryService: ClaimCategoryService,
    private readonly areaService: AreaService,
    private readonly projectService: ProjectService,
    private readonly criticalityService: ClaimCriticalityService,
  ) {}

  /**
   * Create a claim
   * @param request Request to create a new claim
   * @param clientId ID of the client who's presents the claim
   */
  async execute(request: CreateClaimDto, clientId: string) {
    const { issue, description, date, priorityId, categoryId, areaId } =
      request;

    // Generate a unique claim number
    const timestamp = Date.now();
    const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
    const claimNumber = `CLM-${timestamp}-${randomPart}`;

    // Get the priority, category and area
    const priority = await this.priorityService.findById(priorityId);
    const category = await this.categoryService.findById(categoryId);
    const area = await this.areaService.findById(areaId);

    // optional project and criticality
    let project: any = undefined;
    if (request.projectId) {
      project = await this.projectService.findById(request.projectId);
    }

    let criticality: any = undefined;
    if (request.criticalityId) {
      criticality = await this.criticalityService.findById(
        request.criticalityId,
      );
    }

    const claim = Claim.create(
      issue,
      date ? new Date(date) : new Date(),
      priority,
      category,
      claimNumber,
      clientId,
      description,
      area,
      project,
      criticality,
    );

    // Save the claim into database
    const claimId = await this.claimService.save(claim);

    return claimId;
  }
}
