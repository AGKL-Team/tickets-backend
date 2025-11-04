import { ConflictException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DeletePriority } from '../../../src/module/tickets/application/useCases/delete-priority.use-case';
import { PriorityService } from '../../../src/module/tickets/infrastructure/services/priority.service';

describe('DeletePriority UseCase', () => {
  let useCase: DeletePriority;
  let priorityService: Partial<PriorityService>;

  beforeEach(async () => {
    priorityService = {
      hasClaimsAssociated: jest.fn(),
      delete: jest.fn(),
    } as any;

    const module = await Test.createTestingModule({
      providers: [
        DeletePriority,
        { provide: PriorityService, useValue: priorityService },
      ],
    }).compile();

    useCase = module.get<DeletePriority>(DeletePriority);
  });

  afterEach(() => jest.resetAllMocks());

  it('throws when hasAssociated is not null/true', async () => {
    (priorityService.hasClaimsAssociated as jest.Mock).mockResolvedValue(true);
    await expect(useCase.execute('id')).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it('deletes when no association', async () => {
    (priorityService.hasClaimsAssociated as jest.Mock).mockResolvedValue(null);
    (priorityService.delete as jest.Mock).mockResolvedValue(undefined);

    const res = await useCase.execute('id');
    expect(priorityService.delete).toHaveBeenCalledWith('id');
    expect(res).toEqual({ deleted: true });
  });
});
