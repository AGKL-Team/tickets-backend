import { ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AreaController } from '../../../src/module/tickets/api/area.controller';
import { CreateAreaDto } from '../../../src/module/tickets/application/dto/create-area.dto';
import { UpdateAreaDto } from '../../../src/module/tickets/application/dto/update-area.dto';
import { CreateArea } from '../../../src/module/tickets/application/useCases/create-area.use-case';
import { UpdateArea } from '../../../src/module/tickets/application/useCases/update-area.use-case';
import { ClaimService } from '../../../src/module/tickets/infrastructure/services';
import { AreaService } from '../../../src/module/tickets/infrastructure/services/area.service';
import { UserRoleService } from '../../../src/module/tickets/infrastructure/services/user-role.service';
import { SupabaseTestProvider } from '../../shared/providers/supabase-config-test.provider';

describe('AreaController (integration)', () => {
  let controller: AreaController;
  let service: AreaService;
  let createUc: CreateArea;
  let updateUc: UpdateArea;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AreaController],
      providers: [
        {
          provide: AreaService,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
            delete: jest.fn(),
          },
        },
        { provide: CreateArea, useValue: { execute: jest.fn() } },
        { provide: UpdateArea, useValue: { execute: jest.fn() } },
        { provide: UserRoleService, useValue: { findByUserId: jest.fn() } },
        {
          provide: ClaimService,
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

    controller = module.get<AreaController>(AreaController);
    service = module.get<AreaService>(AreaService);
    createUc = module.get<CreateArea>(CreateArea);
    updateUc = module.get<UpdateArea>(UpdateArea);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(createUc).toBeDefined();
    expect(updateUc).toBeDefined();
  });

  describe('create', () => {
    it('delegates to CreateArea use case', async () => {
      const dtoPlain = { name: 'NEW', description: 'd' };
      const pipe = new ValidationPipe({ whitelist: true, transform: true });
      const dto = (await pipe.transform(dtoPlain, {
        type: 'body',
        metatype: CreateAreaDto,
      })) as CreateAreaDto;

      jest.spyOn(createUc as any, 'execute').mockResolvedValue({ id: 'a-1' });

      const res = await controller.create(dto);

      expect(createUc.execute).toHaveBeenCalledWith(dto);
      expect(res).toEqual({ id: 'a-1' });
    });
  });

  describe('findAll / findOne', () => {
    it('calls service.findAll and findById', async () => {
      const list = [{ id: 'a1' }];
      jest.spyOn(service as any, 'findAll').mockResolvedValue(list);
      jest.spyOn(service as any, 'findById').mockResolvedValue(list[0]);

      const resAll = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(resAll).toBe(list);

      const resOne = await controller.findOne('a1');
      expect(service.findById).toHaveBeenCalledWith('a1');
      expect(resOne).toBe(list[0]);
    });
  });

  describe('update / remove', () => {
    it('delegates update and delete', async () => {
      jest.spyOn(updateUc as any, 'execute').mockResolvedValue({ id: 'a1' });
      jest.spyOn(service as any, 'delete').mockResolvedValue(undefined);

      const dtoPlain = { name: 'X' };
      const pipe = new ValidationPipe({ whitelist: true, transform: true });
      const dto = (await pipe.transform(dtoPlain, {
        type: 'body',
        metatype: UpdateAreaDto,
      })) as UpdateAreaDto;

      const res = await controller.update('a1', dto);
      expect(updateUc.execute).toHaveBeenCalledWith('a1', dto);
      expect(res).toEqual({ id: 'a1' });

      const del = await controller.remove('a1');
      expect(service.delete).toHaveBeenCalledWith('a1');
      expect(del).toEqual({ deleted: true });
    });
  });
});
