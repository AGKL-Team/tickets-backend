import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClaimController } from '../../../src/module/tickets/api/claim.controller';
import { CreateClaimDto } from '../../../src/module/tickets/application/dto/create-claim.dto';
import { CreateClaim } from '../../../src/module/tickets/application/useCases/create-claim.use-case';
import { UpdateClaim } from '../../../src/module/tickets/application/useCases/update-claim.use-case';
import {
  Area,
  Claim,
  ClaimCategory,
  ClaimCriticality,
  Priority,
  Project,
  UserRole,
} from '../../../src/module/tickets/domain/models';
import {
  AreaService,
  ClaimCategoryService,
  PriorityService,
  UserRoleService,
} from '../../../src/module/tickets/infrastructure/services';
import { ClaimCriticalityService } from '../../../src/module/tickets/infrastructure/services/claim-criticality.service';
import { ClaimService } from '../../../src/module/tickets/infrastructure/services/claim.service';
import { ProjectService } from '../../../src/module/tickets/infrastructure/services/project.service';
import { fakeApplicationUser } from '../../shared/fakes/user.fake';
import { FirebaseTestProvider } from '../../shared/providers/firebase-config-test.provider';

describe('ClaimController', () => {
  let controller: ClaimController;
  let service: ClaimService;
  let createClaimUseCase: CreateClaim;
  let updateClaimUseCase: UpdateClaim;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [ClaimController],
      providers: [
        ClaimService,
        UserRoleService,
        PriorityService,
        ClaimCategoryService,
        AreaService,
        ProjectService,
        ClaimCriticalityService,
        CreateClaim,
        UpdateClaim,
        {
          provide: getRepositoryToken(Claim),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(UserRole),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Priority),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(ClaimCategory),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Area),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Project),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(ClaimCriticality),
          useClass: Repository,
        },
        FirebaseTestProvider,
      ],
    }).compile();

    controller = module.get<ClaimController>(ClaimController);
    service = module.get<ClaimService>(ClaimService);
    createClaimUseCase = module.get<CreateClaim>(CreateClaim);
    updateClaimUseCase = module.get<UpdateClaim>(UpdateClaim);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(createClaimUseCase).toBeDefined();
    expect(updateClaimUseCase).toBeDefined();
  });

  describe('create', () => {
    it('should call CreateClaim.execute with request and user id', async () => {
      const dto: CreateClaimDto = {
        issue: 'x',
        priorityId: 'p1',
        categoryId: 'c1',
        areaId: 'a1',
      };

      jest
        .spyOn(createClaimUseCase as any, 'execute')
        .mockResolvedValue({ id: 'created-id' });

      const res = await controller.create(dto, fakeApplicationUser);

      expect(createClaimUseCase.execute).toHaveBeenCalledWith(
        dto,
        fakeApplicationUser.id,
      );
      expect(res).toEqual({ id: 'created-id' });
    });

    it('should create Claim when the user logged in is an admin', async () => {
      const dto: CreateClaimDto = {
        issue: 'x',
        priorityId: 'p1',
        categoryId: 'c1',
        areaId: 'a1',
      };

      jest
        .spyOn(createClaimUseCase as any, 'execute')
        .mockResolvedValue({ id: 'created-id' });

      const res = await controller.create(dto, fakeApplicationUser);

      expect(createClaimUseCase.execute).toHaveBeenCalledWith(
        dto,
        fakeApplicationUser.id,
      );
      expect(res).toEqual({ id: 'created-id' });
    });
  });

  describe('findAll', () => {
    it('should call ClaimService.findAll with user id and return claims', async () => {
      const claims = [{ id: 'c1' }];
      jest.spyOn(service as any, 'findAll').mockResolvedValue(claims);

      const res = await controller.findAll(fakeApplicationUser as any);

      expect(service.findAll).toHaveBeenCalledWith(fakeApplicationUser.id);
      expect(res).toBe(claims);
    });
  });

  describe('findOne', () => {
    it('should call ClaimService.findById with id and user id and return claim', async () => {
      const claim = { id: 'claim-1' };
      jest.spyOn(service as any, 'findById').mockResolvedValue(claim);

      const res = await controller.findOne('claim-1', fakeApplicationUser);

      expect(service.findById).toHaveBeenCalledWith(
        'claim-1',
        fakeApplicationUser.id,
      );
      expect(res).toBe(claim);
    });
  });

  describe('update', () => {
    it('should call UpdateClaim.execute with id, dto and user id', async () => {
      const dto = { description: 'updated' } as any;
      jest
        .spyOn(updateClaimUseCase as any, 'execute')
        .mockResolvedValue({ id: 'claim-2' });

      const res = await controller.update('claim-2', dto, fakeApplicationUser);

      expect(updateClaimUseCase.execute).toHaveBeenCalledWith(
        'claim-2',
        dto,
        fakeApplicationUser.id,
      );
      expect(res).toEqual({ id: 'claim-2' });
    });
  });

  describe('remove', () => {
    it('should call ClaimService.delete and return deleted true', async () => {
      jest.spyOn(service as any, 'delete').mockResolvedValue(undefined);

      const res = await controller.remove('claim-del');

      expect(service.delete).toHaveBeenCalledWith('claim-del');
      expect(res).toEqual({ deleted: true });
    });
  });
});
