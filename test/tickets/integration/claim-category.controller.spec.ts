import { ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ClaimCategoryController } from '../../../src/module/tickets/api/claim-category.controller';
import { CreateClaimCategoryDto } from '../../../src/module/tickets/application/dto/create-claim-category.dto';
import { UpdateClaimCategoryDto } from '../../../src/module/tickets/application/dto/update-claim-category.dto';
import { CreateClaimCategory } from '../../../src/module/tickets/application/useCases/create-claim-category.use-case';
import { UpdateClaimCategory } from '../../../src/module/tickets/application/useCases/update-claim-category.use-case';
import { ClaimCategoryFirestoreRepository } from '../../../src/module/tickets/infrastructure/repositories/claim-category.firestore.repository';
import { ClaimFirestoreRepository } from '../../../src/module/tickets/infrastructure/repositories/claim.firestore.repository';
import { ClaimCategoryService } from '../../../src/module/tickets/infrastructure/services/claim-category.service';
import { SupabaseTestProvider } from '../../shared/providers/supabase-config-test.provider';

describe('ClaimCategoryController (integration)', () => {
  let controller: ClaimCategoryController;
  let service: ClaimCategoryService;
  let createUc: CreateClaimCategory;
  let updateUc: UpdateClaimCategory;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [ClaimCategoryController],
      providers: [
        ClaimCategoryService,
        CreateClaimCategory,
        UpdateClaimCategory,
        {
          provide: ClaimFirestoreRepository,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            findById: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: ClaimCategoryFirestoreRepository,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        ClaimCategoryFirestoreRepository,
        SupabaseTestProvider,
      ],
    }).compile();

    controller = module.get<ClaimCategoryController>(ClaimCategoryController);
    service = module.get<ClaimCategoryService>(ClaimCategoryService);
    createUc = module.get<CreateClaimCategory>(CreateClaimCategory);
    updateUc = module.get<UpdateClaimCategory>(UpdateClaimCategory);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(createUc).toBeDefined();
    expect(updateUc).toBeDefined();
  });

  describe('create', () => {
    it('delegates to CreateClaimCategory use case', async () => {
      const dtoPlain = { name: 'NEW', description: 'd' };
      const pipe = new ValidationPipe({ whitelist: true, transform: true });
      const dto = (await pipe.transform(dtoPlain, {
        type: 'body',
        metatype: CreateClaimCategoryDto,
      })) as CreateClaimCategoryDto;

      jest.spyOn(createUc as any, 'execute').mockResolvedValue({ id: 'cat-1' });

      const res = await controller.create(dto);

      expect(createUc.execute).toHaveBeenCalledWith(dto);
      expect(res).toEqual({ id: 'cat-1' });
    });
  });

  describe('findAll / findOne', () => {
    it('calls service.findAll and findById', async () => {
      const list = [{ id: 'c1' }];
      jest.spyOn(service as any, 'findAll').mockResolvedValue(list);
      jest.spyOn(service as any, 'findById').mockResolvedValue(list[0]);

      const resAll = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(resAll).toBe(list);

      const resOne = await controller.findOne('c1');
      expect(service.findById).toHaveBeenCalledWith('c1');
      expect(resOne).toBe(list[0]);
    });
  });

  describe('update / remove', () => {
    it('delegates update and delete', async () => {
      jest.spyOn(updateUc as any, 'execute').mockResolvedValue({ id: 'c1' });
      jest.spyOn(service as any, 'delete').mockResolvedValue(undefined);

      const dtoPlain = { name: 'X' };
      const pipe = new ValidationPipe({ whitelist: true, transform: true });
      const dto = (await pipe.transform(dtoPlain, {
        type: 'body',
        metatype: UpdateClaimCategoryDto,
      })) as UpdateClaimCategoryDto;

      const res = await controller.update('c1', dto);
      expect(updateUc.execute).toHaveBeenCalledWith('c1', dto);
      expect(res).toEqual({ id: 'c1' });

      const del = await controller.remove('c1');
      expect(service.delete).toHaveBeenCalledWith('c1');
      expect(del).toEqual({ deleted: true });
    });
  });
});
