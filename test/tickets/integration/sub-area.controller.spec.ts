import { Test } from '@nestjs/testing';
import { SubAreaController } from '../../../src/module/tickets/api/sub-area.controller';
import { CreateSubAreaDto } from '../../../src/module/tickets/application/dto/create-sub-area.dto';
import { UpdateSubAreaDto } from '../../../src/module/tickets/application/dto/update-sub-area.dto';
import { CreateSubArea } from '../../../src/module/tickets/application/useCases/create-sub-area.use-case';
import { UpdateSubArea } from '../../../src/module/tickets/application/useCases/update-sub-area.use-case';
import { AreaFirestoreRepository } from '../../../src/module/tickets/infrastructure/repositories/area.firestore.repository';
import { ClaimFirestoreRepository } from '../../../src/module/tickets/infrastructure/repositories/claim.firestore.repository';
import { SubAreaFirestoreRepository } from '../../../src/module/tickets/infrastructure/repositories/sub-area.firestore.repository';
import { AreaService } from '../../../src/module/tickets/infrastructure/services/area.service';
import { SubAreaService } from '../../../src/module/tickets/infrastructure/services/sub-area.service';
import { UserRoleService } from '../../../src/module/tickets/infrastructure/services/user-role.service';
import { SupabaseTestProvider } from '../../shared/providers/supabase-config-test.provider';

describe('SubAreaController (integration)', () => {
  let controller: SubAreaController;
  let service: SubAreaService;
  let createUc: CreateSubArea;
  let updateUc: UpdateSubArea;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [SubAreaController],
      providers: [
        SubAreaService,
        CreateSubArea,
        UpdateSubArea,
        // AreaService required by use-cases
        AreaService,
        { provide: UserRoleService, useValue: { findByUserId: jest.fn() } },
        {
          provide: ClaimFirestoreRepository,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: SubAreaFirestoreRepository,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findByName: jest.fn(),
          },
        },
        {
          provide: AreaFirestoreRepository,
          useValue: { findById: jest.fn(), findAll: jest.fn() },
        },
        SupabaseTestProvider,
      ],
    }).compile();

    controller = module.get<SubAreaController>(SubAreaController);
    service = module.get<SubAreaService>(SubAreaService);
    createUc = module.get<CreateSubArea>(CreateSubArea);
    updateUc = module.get<UpdateSubArea>(UpdateSubArea);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(createUc).toBeDefined();
    expect(updateUc).toBeDefined();
  });

  describe('create', () => {
    it('delegates to CreateSubArea use case', async () => {
      const dtoPlain = {
        name: 'NEW',
        description: 'd',
        areaId: '00000000-0000-0000-0000-000000000001',
      };
      // build DTO instance (use class instance to match controller typing)
      const dto = Object.assign(
        new CreateSubAreaDto(),
        dtoPlain,
      ) as CreateSubAreaDto;

      jest.spyOn(createUc as any, 'execute').mockResolvedValue({ id: 's-1' });

      const res = await controller.create(dto);

      expect(createUc.execute).toHaveBeenCalledWith(dto);
      expect(res).toEqual({ id: 's-1' });
    });
  });

  describe('findAll / findOne', () => {
    it('calls service.findAll and findById', async () => {
      const list = [{ id: 's1' }];
      jest.spyOn(service as any, 'findAll').mockResolvedValue(list);
      jest.spyOn(service as any, 'findById').mockResolvedValue(list[0]);

      const resAll = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(resAll).toBe(list);

      const resOne = await controller.findOne('s1');
      expect(service.findById).toHaveBeenCalledWith('s1');
      expect(resOne).toBe(list[0]);
    });
  });

  describe('update / remove', () => {
    it('delegates update and delete', async () => {
      jest.spyOn(updateUc as any, 'execute').mockResolvedValue({ id: 's1' });
      jest.spyOn(service as any, 'delete').mockResolvedValue(undefined);

      const dtoPlain = { name: 'X' };
      const dto = Object.assign(
        new UpdateSubAreaDto(),
        dtoPlain,
      ) as UpdateSubAreaDto;

      const res = await controller.update('s1', dto);
      expect(updateUc.execute).toHaveBeenCalledWith('s1', dto);
      expect(res).toEqual({ id: 's1' });

      const del = await controller.remove('s1');
      expect(service.delete).toHaveBeenCalledWith('s1');
      expect(del).toEqual({ deleted: true });
    });
  });
});
