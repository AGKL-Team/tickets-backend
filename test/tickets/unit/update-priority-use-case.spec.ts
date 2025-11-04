import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { UpdatePriorityDto } from '../../../src/module/tickets/application/dto/update-priority.dto';
import { UpdatePriority } from '../../../src/module/tickets/application/useCases/update-priority.use-case';
import { PriorityService } from '../../../src/module/tickets/infrastructure/services/priority.service';

describe('UpdatePriority use case', () => {
  let useCase: UpdatePriority;
  let priorityService: jest.Mocked<Partial<PriorityService>>;

  beforeEach(async () => {
    priorityService = {
      findById: jest.fn(),
      findByNumber: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<Partial<PriorityService>>;

    const moduleRef = await Test.createTestingModule({
      providers: [
        UpdatePriority,
        { provide: PriorityService, useValue: priorityService },
      ],
    }).compile();

    useCase = moduleRef.get<UpdatePriority>(UpdatePriority);
  });

  it('updates number and description when new number is unique', async () => {
    const existing = {
      id: 'p1',
      number: 1,
      description: 'old',
      changeNumber(n: number) {
        this.number = n;
      },
      changeDescription(d: string) {
        this.description = d;
      },
    } as any;
    (priorityService.findById as jest.Mock).mockResolvedValue(existing);
    (priorityService.findByNumber as jest.Mock).mockResolvedValue(null);
    (priorityService.save as jest.Mock).mockImplementation((ent: any) => ent);

    const req: UpdatePriorityDto = { number: 2, description: 'new' };
    const result = await useCase.execute('p1', req);

    expect(priorityService.findById).toHaveBeenCalledWith('p1');
    expect(priorityService.findByNumber).toHaveBeenCalledWith(2);
    expect(priorityService.save).toHaveBeenCalled();
    expect(result.number).toBe(2);
    expect(result.description).toBe('new');
  });

  it('updates only description when number not provided', async () => {
    const existing = {
      id: 'p2',
      number: 5,
      description: 'old',
      changeNumber(n: number) {
        this.number = n;
      },
      changeDescription(d: string) {
        this.description = d;
      },
    } as any;
    (priorityService.findById as jest.Mock).mockResolvedValue(existing);
    (priorityService.save as jest.Mock).mockImplementation((ent: any) => ent);

    const req: UpdatePriorityDto = { description: 'desc updated' };
    const result = await useCase.execute('p2', req);

    expect(priorityService.findById).toHaveBeenCalledWith('p2');
    expect(priorityService.findByNumber).not.toHaveBeenCalled();
    expect(result.number).toBe(5);
    expect(result.description).toBe('desc updated');
  });

  it('throws ConflictException when new number already exists', async () => {
    const existing = {
      id: 'p3',
      number: 1,
      description: 'old',
      changeNumber(n: number) {
        this.number = n;
      },
      changeDescription(d: string) {
        this.description = d;
      },
    } as any;
    const other = { id: 'p4', number: 2, description: 'other' };
    (priorityService.findById as jest.Mock).mockResolvedValue(existing);
    (priorityService.findByNumber as jest.Mock).mockResolvedValue(other as any);

    const req: UpdatePriorityDto = { number: 2 };

    await expect(useCase.execute('p3', req)).rejects.toThrow(ConflictException);
    await expect(useCase.execute('p3', req)).rejects.toThrow(
      `Ya existe una prioridad con el número ${req.number}`,
    );
  });

  it('propagates NotFoundException when priority is not found', async () => {
    (priorityService.findById as jest.Mock).mockRejectedValue(
      new NotFoundException('No existe'),
    );

    const req: UpdatePriorityDto = { description: 'x' };

    await expect(useCase.execute('not-found-id', req)).rejects.toThrow(
      NotFoundException,
    );
  });
});
