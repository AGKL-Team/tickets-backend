import { ConflictException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CreateArea } from '../../../src/module/tickets/application/useCases/create-area.use-case';
import { AreaService } from '../../../src/module/tickets/infrastructure/services';

describe('CreateArea use-case', () => {
  let usecase: CreateArea;
  let areaService: Partial<AreaService>;

  beforeEach(async () => {
    areaService = {
      findByName: jest.fn(),
      save: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [CreateArea, { provide: AreaService, useValue: areaService }],
    }).compile();

    usecase = module.get(CreateArea);
  });

  it('creates an area when name is unique', async () => {
    (areaService.findByName as jest.Mock).mockResolvedValue(null);
    (areaService.save as jest.Mock).mockResolvedValue({ id: 'a1' });

    const res = await usecase.execute({ name: 'Nueva', description: 'd' });
    expect(res).toBe('a1');
    expect(areaService.save).toHaveBeenCalled();
  });

  it('throws ConflictException when name exists', async () => {
    (areaService.findByName as jest.Mock).mockResolvedValue({ id: 'x' });
    await expect(
      usecase.execute({ name: 'Dup', description: '' }),
    ).rejects.toThrow(ConflictException);
  });
});
