import { ClaimCategoryController } from '../../../src/module/tickets/api/claim-category.controller';
import { CreateClaimCategory } from '../../../src/module/tickets/application/useCases/create-claim-category.use-case';
import { UpdateClaimCategory } from '../../../src/module/tickets/application/useCases/update-claim-category.use-case';
import { ClaimCategoryService } from '../../../src/module/tickets/infrastructure/services/claim-category.service';

describe('ClaimCategoryController (unit)', () => {
  let controller: ClaimCategoryController;
  let service: Partial<ClaimCategoryService>;
  let createUc: Partial<CreateClaimCategory>;
  let updateUc: Partial<UpdateClaimCategory>;

  beforeEach(() => {
    service = {
      findAll: jest.fn(),
      findById: jest.fn(),
      delete: jest.fn(),
    } as any;
    createUc = { execute: jest.fn() } as any;
    updateUc = { execute: jest.fn() } as any;

    controller = new ClaimCategoryController(
      service as any,
      createUc as any,
      updateUc as any,
    );
  });

  afterEach(() => jest.resetAllMocks());

  it('create delegates to use case', async () => {
    (createUc.execute as jest.Mock).mockResolvedValue('id');
    const res = await controller.create({ name: 'x', description: '' } as any);
    expect(createUc.execute).toHaveBeenCalled();
    expect(res).toBe('id');
  });

  it('findAll delegates to service', async () => {
    (service.findAll as jest.Mock).mockResolvedValue([]);
    const res = await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
    expect(res).toEqual([]);
  });

  it('findOne delegates to service', async () => {
    (service.findById as jest.Mock).mockResolvedValue({ id: 'c1' });
    const res = await controller.findOne('c1');
    expect(service.findById).toHaveBeenCalledWith('c1');
    expect(res).toEqual({ id: 'c1' });
  });

  it('update delegates to use case', async () => {
    const dto = { name: 'N' } as any;
    (updateUc.execute as jest.Mock).mockResolvedValue('updated');
    const res = await controller.update('id', dto);
    expect(updateUc.execute).toHaveBeenCalledWith('id', dto);
    expect(res).toBe('updated');
  });

  it('remove calls service.delete and returns deleted true', async () => {
    (service.delete as jest.Mock).mockResolvedValue(undefined);
    const res = await controller.remove('id');
    expect(service.delete).toHaveBeenCalledWith('id');
    expect(res).toEqual({ deleted: true });
  });
});
