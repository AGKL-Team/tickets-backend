import { ConflictException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CreateSubArea } from '../../../src/module/tickets/application/useCases/create-sub-area.use-case';
import {
  AreaService,
  SubAreaService,
} from '../../../src/module/tickets/infrastructure/services';

describe('CreateSubArea use-case', () => {
  let usecase: CreateSubArea;
  let subAreaService: Partial<Record<string, jest.Mock>>;
  let areaService: Partial<Record<string, jest.Mock>>;

  beforeEach(async () => {
    subAreaService = { findByName: jest.fn(), save: jest.fn() };
    areaService = { findById: jest.fn() };

    const module = await Test.createTestingModule({
      providers: [
        CreateSubArea,
        { provide: SubAreaService, useValue: subAreaService },
        { provide: AreaService, useValue: areaService },
      ],
    }).compile();

    usecase = module.get(CreateSubArea);
  });

  it('creates subarea when name unique in area', async () => {
    (areaService.findById as jest.Mock).mockResolvedValue({
      id: 'a1',
      name: 'A',
    });
    (subAreaService.findByName as jest.Mock).mockResolvedValue(null);
    (subAreaService.save as jest.Mock).mockResolvedValue({ id: 's1' });

    const res = await usecase.execute({
      name: 's',
      description: '',
      areaId: 'a1',
    });
    expect(res).toBe('s1');
  });

  it('throws ConflictException when subarea exists in same area', async () => {
    (areaService.findById as jest.Mock).mockResolvedValue({
      id: 'a1',
      name: 'A',
    });
    (subAreaService.findByName as jest.Mock).mockResolvedValue({
      id: 's',
      area: { id: 'a1' },
    });

    await expect(
      usecase.execute({ name: 'dup', description: '', areaId: 'a1' }),
    ).rejects.toThrow(ConflictException);
  });
});
