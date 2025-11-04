import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CreatePriority } from '../../../src/module/tickets/application/useCases/create-priority.use-case';
import { PriorityService } from '../../../src/module/tickets/infrastructure/services/priority.service';

describe('CreatePriority UseCase', () => {
  let useCase: CreatePriority;
  let priorityService: Partial<PriorityService>;

  beforeEach(async () => {
    priorityService = { findByNumber: jest.fn(), save: jest.fn() } as any;

    const module = await Test.createTestingModule({
      providers: [
        CreatePriority,
        { provide: PriorityService, useValue: priorityService },
      ],
    }).compile();

    useCase = module.get<CreatePriority>(CreatePriority);
  });

  afterEach(() => jest.resetAllMocks());

  it('throws when number already exists', async () => {
    (priorityService.findByNumber as jest.Mock).mockResolvedValue({ id: 'p1' });
    await expect(
      useCase.execute({ number: 1, description: 'd' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('creates when number is new', async () => {
    (priorityService.findByNumber as jest.Mock).mockResolvedValue(undefined);
    const saved = { id: 'p2' };
    (priorityService.save as jest.Mock).mockResolvedValue(saved);

    const res = await useCase.execute({ number: 2, description: 'x' });
    expect(priorityService.save).toHaveBeenCalled();
    expect(res).toBe(saved);
  });
});
