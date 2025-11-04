import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DeleteArea } from '../../../src/module/tickets/application/useCases/delete-area.use-case';
import {
  AreaService,
  SubAreaService,
} from '../../../src/module/tickets/infrastructure/services';

describe('DeleteArea use-case', () => {
  let usecase: DeleteArea;
  let areaService: Partial<Record<string, jest.Mock>>;
  let subAreaService: Partial<Record<string, jest.Mock>>;

  beforeEach(async () => {
    areaService = { hasClaimsAssociated: jest.fn(), delete: jest.fn() };
    subAreaService = { hasSubAreas: jest.fn() };

    const module = await Test.createTestingModule({
      providers: [
        DeleteArea,
        { provide: AreaService, useValue: areaService },
        { provide: SubAreaService, useValue: subAreaService },
      ],
    }).compile();

    usecase = module.get(DeleteArea);
  });

  it('throws when area has claims', async () => {
    (areaService.hasClaimsAssociated as jest.Mock).mockResolvedValue({
      id: 'c',
    });
    await expect(usecase.execute('a1')).rejects.toThrow(BadRequestException);
  });

  it('throws when area has subareas', async () => {
    (areaService.hasClaimsAssociated as jest.Mock).mockResolvedValue(null);
    (subAreaService.hasSubAreas as jest.Mock).mockResolvedValue({ id: 's' });
    await expect(usecase.execute('a1')).rejects.toThrow(BadRequestException);
  });

  it('deletes when no associations', async () => {
    (areaService.hasClaimsAssociated as jest.Mock).mockResolvedValue(null);
    (subAreaService.hasSubAreas as jest.Mock).mockResolvedValue(null);
    (areaService.delete as jest.Mock).mockResolvedValue(true);

    const res = await usecase.execute('a1');
    expect(areaService.delete).toHaveBeenCalledWith('a1');
    expect(res).toEqual({ deleted: true });
  });
});
