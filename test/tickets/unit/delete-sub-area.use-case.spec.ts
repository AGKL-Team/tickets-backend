import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DeleteSubArea } from '../../../src/module/tickets/application/useCases/delete-sub-area.use-case';
import { SubAreaService } from '../../../src/module/tickets/infrastructure/services';

describe('DeleteSubArea use-case', () => {
  let usecase: DeleteSubArea;
  let subAreaService: Partial<Record<string, jest.Mock>>;

  beforeEach(async () => {
    subAreaService = { hasClaimsAssociated: jest.fn(), delete: jest.fn() };

    const module = await Test.createTestingModule({
      providers: [
        DeleteSubArea,
        { provide: SubAreaService, useValue: subAreaService },
      ],
    }).compile();

    usecase = module.get(DeleteSubArea);
  });

  it('throws when subarea has claims', async () => {
    (subAreaService.hasClaimsAssociated as jest.Mock).mockResolvedValue({
      id: 'c',
    });
    await expect(usecase.execute('s1')).rejects.toThrow(BadRequestException);
  });

  it('deletes when no claims', async () => {
    (subAreaService.hasClaimsAssociated as jest.Mock).mockResolvedValue(null);
    (subAreaService.delete as jest.Mock).mockResolvedValue(true);

    const res = await usecase.execute('s1');
    expect(subAreaService.delete).toHaveBeenCalledWith('s1');
    expect(res).toEqual({ deleted: true });
  });
});
