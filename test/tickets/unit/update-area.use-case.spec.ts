import { ConflictException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { UpdateArea } from '../../../src/module/tickets/application/useCases/update-area.use-case';
import { AreaService } from '../../../src/module/tickets/infrastructure/services';

describe('UpdateArea use-case', () => {
  let usecase: UpdateArea;
  let areaService: Partial<Record<string, jest.Mock>>;

  beforeEach(async () => {
    areaService = {
      findById: jest.fn(),
      findByName: jest.fn(),
      update: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [UpdateArea, { provide: AreaService, useValue: areaService }],
    }).compile();

    usecase = module.get(UpdateArea);
  });

  it('updates name and description when valid', async () => {
    const existing = {
      id: 'a1',
      name: 'OLD',
      changeName: jest.fn(),
      changeDescription: jest.fn(),
    } as any;
    (areaService.findById as jest.Mock).mockResolvedValue(existing);
    (areaService.findByName as jest.Mock).mockResolvedValue(null);
    (areaService.update as jest.Mock).mockResolvedValue({
      id: 'a1',
      name: 'NEW',
    });

    const res = await usecase.execute('a1', { name: 'new', description: 'd' });
    expect(areaService.update).toHaveBeenCalled();
    expect(res).toEqual({ id: 'a1', name: 'NEW' });
  });

  it('throws ConflictException when another with same name exists', async () => {
    const existing = { id: 'a1', name: 'OLD' } as any;
    (areaService.findById as jest.Mock).mockResolvedValue(existing);
    (areaService.findByName as jest.Mock).mockResolvedValue({ id: 'other' });

    await expect(usecase.execute('a1', { name: 'dup' })).rejects.toThrow(
      ConflictException,
    );
  });
});
