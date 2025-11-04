import { PriorityController } from '../../../src/module/tickets/api/priority.controller';
import { CreatePriority } from '../../../src/module/tickets/application/useCases/create-priority.use-case';
import { UpdatePriority } from '../../../src/module/tickets/application/useCases/update-priority.use-case';
import { PriorityService } from '../../../src/module/tickets/infrastructure/services/priority.service';

describe('PriorityController (unit)', () => {
  let controller: PriorityController;
  let service: Partial<PriorityService>;
  let createUc: Partial<CreatePriority>;
  let updateUc: Partial<UpdatePriority>;

  beforeEach(() => {
    service = {
      findAll: jest.fn(),
      findById: jest.fn(),
      delete: jest.fn(),
    } as any;
    createUc = { execute: jest.fn() } as any;
    updateUc = { execute: jest.fn() } as any;

    controller = new PriorityController(
      service as any,
      createUc as any,
      updateUc as any,
    );
  });

  afterEach(() => jest.resetAllMocks());

  it('create delegates to use case', async () => {
    (createUc.execute as jest.Mock).mockResolvedValue('ok');
    const res = await controller.create({ number: 1, description: 'd' } as any);
    expect(createUc.execute).toHaveBeenCalled();
    expect(res).toBe('ok');
  });

  it('findAll delegates to service', async () => {
    (service.findAll as jest.Mock).mockResolvedValue([]);
    const res = await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
    expect(res).toEqual([]);
  });

  it('findOne delegates to service', async () => {
    (service.findById as jest.Mock).mockResolvedValue({ id: 'p1' });
    const res = await controller.findOne('p1');
    expect(service.findById).toHaveBeenCalledWith('p1');
    expect(res).toEqual({ id: 'p1' });
  });

  it('update delegates to use case', async () => {
    (updateUc.execute as jest.Mock).mockResolvedValue('updated');
    const res = await controller.update('p1', { number: 2 } as any);
    expect(updateUc.execute).toHaveBeenCalledWith('p1', { number: 2 });
    expect(res).toBe('updated');
  });

  it('remove calls service.delete and returns deleted true', async () => {
    (service.delete as jest.Mock).mockResolvedValue(undefined);
    const res = await controller.remove('p1');
    expect(service.delete).toHaveBeenCalledWith('p1');
    expect(res).toEqual({ deleted: true });
  });
});
