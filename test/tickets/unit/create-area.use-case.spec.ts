import { ConflictException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CreateArea } from '../../../src/module/tickets/application/useCases/create-area.use-case';
import {
  AreaService,
  ProjectService,
} from '../../../src/module/tickets/infrastructure/services';

describe('CreateArea use-case', () => {
  let usecase: CreateArea;
  let areaService: Partial<AreaService>;
  let projectService: Partial<any>;

  beforeEach(async () => {
    areaService = {
      findByNameInProject: jest.fn(),
      save: jest.fn(),
    };
    projectService = { findById: jest.fn() };

    const module = await Test.createTestingModule({
      providers: [
        CreateArea,
        { provide: AreaService, useValue: areaService },
        { provide: ProjectService, useValue: projectService },
      ],
    }).compile();

    usecase = module.get(CreateArea);
  });

  it('creates an area when name is unique', async () => {
    (areaService.findByNameInProject as jest.Mock).mockResolvedValue(null);
    (areaService.save as jest.Mock).mockResolvedValue({ id: 'a1' });

    const res = await usecase.execute({ name: 'Nueva', description: 'd' });
    expect(res).toBe('a1');
    expect(areaService.save).toHaveBeenCalled();
  });

  it('throws ConflictException when name exists', async () => {
    (areaService.findByNameInProject as jest.Mock).mockResolvedValue({
      id: 'x',
    });
    await expect(
      usecase.execute({ name: 'Dup', description: '' }),
    ).rejects.toThrow(ConflictException);
  });
});
