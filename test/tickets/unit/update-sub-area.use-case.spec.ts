import { ConflictException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { UpdateSubArea } from '../../../src/module/tickets/application/useCases/update-sub-area.use-case';
import {
  AreaService,
  SubAreaService,
} from '../../../src/module/tickets/infrastructure/services';

describe('UpdateSubArea use-case', () => {
  let usecase: UpdateSubArea;
  let subAreaService: Partial<Record<string, jest.Mock>>;
  let areaService: Partial<Record<string, jest.Mock>>;

  beforeEach(async () => {
    subAreaService = {
      findById: jest.fn(),
      findByName: jest.fn(),
      update: jest.fn(),
    };
    areaService = { findById: jest.fn() };

    const module = await Test.createTestingModule({
      providers: [
        UpdateSubArea,
        { provide: SubAreaService, useValue: subAreaService },
        { provide: AreaService, useValue: areaService },
      ],
    }).compile();

    usecase = module.get(UpdateSubArea);
  });

  it('updates when valid and name not conflict', async () => {
    const existing = {
      id: 's1',
      name: 'OLD',
      area: { id: 'a1' },
      changeName: jest.fn(),
      changeDescription: jest.fn(),
      changeArea: jest.fn(),
    } as any;
    (subAreaService.findById as jest.Mock).mockResolvedValue(existing);
    (subAreaService.findByName as jest.Mock).mockResolvedValue(null);
    (areaService.findById as jest.Mock).mockResolvedValue({ id: 'a2' });
    (subAreaService.update as jest.Mock).mockResolvedValue({
      id: 's1',
      name: 'NEW',
    });

    const res = await usecase.execute('s1', {
      name: 'new',
      description: 'd',
      areaId: 'a2',
    });
    expect(subAreaService.update).toHaveBeenCalled();
    expect(res).toEqual({ id: 's1', name: 'NEW' });
  });

  it('throws ConflictException when name already exists in same area', async () => {
    const existing = { id: 's1', name: 'OLD', area: { id: 'a1' } } as any;
    (subAreaService.findById as jest.Mock).mockResolvedValue(existing);
    (subAreaService.findByName as jest.Mock).mockResolvedValue({
      id: 'other',
      area: { id: 'a1' },
    });

    await expect(usecase.execute('s1', { name: 'dup' })).rejects.toThrow(
      ConflictException,
    );
  });
});
