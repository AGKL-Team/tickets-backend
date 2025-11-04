import { Injectable } from '@nestjs/common';
import { Claim } from '../../domain/models';
import {
  AreaService,
  ClaimCategoryService,
  ClaimService,
  PriorityService,
} from '../../infrastructure/services';
import { CreateClaimDto } from '../dto/create-claim.dto';

@Injectable()
export class CreateClaim {
  constructor(
    private readonly claimService: ClaimService,
    private readonly priorityService: PriorityService,
    private readonly categoryService: ClaimCategoryService,
    private readonly areaService: AreaService,
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

    const claim = Claim.create(
      issue,
      date ? new Date(date) : new Date(),
      priority,
      category,
      claimNumber,
      clientId,
      description,
      area,
    );

    // Save the claim into database
    const claimId = await this.claimService.save(claim);

    return claimId;
  }
}
