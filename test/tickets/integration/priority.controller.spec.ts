import { ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PriorityController } from '../../../src/module/tickets/api/priority.controller';
import { CreatePriorityDto } from '../../../src/module/tickets/application/dto/create-priority.dto';
import { UpdatePriorityDto } from '../../../src/module/tickets/application/dto/update-priority.dto';
import { CreatePriority } from '../../../src/module/tickets/application/useCases/create-priority.use-case';
import { UpdatePriority } from '../../../src/module/tickets/application/useCases/update-priority.use-case';
import { ClaimFirestoreRepository } from '../../../src/module/tickets/infrastructure/repositories/claim.firestore.repository';
import { PriorityFirestoreRepository } from '../../../src/module/tickets/infrastructure/repositories/priority.firestore.repository';
import { PriorityService } from '../../../src/module/tickets/infrastructure/services/priority.service';
import { SupabaseTestProvider } from '../../shared/providers/supabase-config-test.provider';

describe('PriorityController (integration)', () => {
  let controller: PriorityController;
  let service: PriorityService;
  let createUc: CreatePriority;
  let updateUc: UpdatePriority;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [PriorityController],
      providers: [
        PriorityService,
        CreatePriority,
        UpdatePriority,
        {
          provide: PriorityFirestoreRepository,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
            findByNumber: jest.fn(),
          },
        },
        {
          provide: ClaimFirestoreRepository,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
        SupabaseTestProvider,
      ],
    }).compile();

    controller = module.get<PriorityController>(PriorityController);
    service = module.get<PriorityService>(PriorityService);
    createUc = module.get<CreatePriority>(CreatePriority);
    updateUc = module.get<UpdatePriority>(UpdatePriority);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(createUc).toBeDefined();
    expect(updateUc).toBeDefined();
  });

  describe('create', () => {
    it('delegates to CreatePriority use case', async () => {
      const dtoPlain = { number: 1, description: 'High priority' };
      const pipe = new ValidationPipe({ whitelist: true, transform: true });
      const dto = (await pipe.transform(dtoPlain, {
        type: 'body',
        metatype: CreatePriorityDto,
      })) as CreatePriorityDto;

      jest.spyOn(createUc as any, 'execute').mockResolvedValue({ id: 'p1' });

      const res = await controller.create(dto);

      expect(createUc.execute).toHaveBeenCalledWith(dto);
      expect(res).toEqual({ id: 'p1' });
    });
  });

  describe('findAll / findOne', () => {
    it('calls service.findAll and findById', async () => {
      const list = [{ id: 'p1' }];
      jest.spyOn(service as any, 'findAll').mockResolvedValue(list);
      jest.spyOn(service as any, 'findById').mockResolvedValue(list[0]);

      const resAll = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(resAll).toBe(list);

      const resOne = await controller.findOne('p1');
      expect(service.findById).toHaveBeenCalledWith('p1');
      expect(resOne).toBe(list[0]);
    });
  });

  describe('update / remove', () => {
    it('delegates update and delete', async () => {
      jest.spyOn(updateUc as any, 'execute').mockResolvedValue({ id: 'p1' });
      jest.spyOn(service as any, 'delete').mockResolvedValue(undefined);

      const dtoPlain = { description: 'X' };
      const pipe = new ValidationPipe({ whitelist: true, transform: true });
      const dto = (await pipe.transform(dtoPlain, {
        type: 'body',
        metatype: UpdatePriorityDto,
      })) as UpdatePriorityDto;

      const res = await controller.update('p1', dto);
      expect(updateUc.execute).toHaveBeenCalledWith('p1', dto);
      expect(res).toEqual({ id: 'p1' });

      const del = await controller.remove('p1');
      expect(service.delete).toHaveBeenCalledWith('p1');
      expect(del).toEqual({ deleted: true });
    });
  });
});
