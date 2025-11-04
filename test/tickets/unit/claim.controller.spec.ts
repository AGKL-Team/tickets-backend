import { ClaimController } from '../../../src/module/tickets/api/claim.controller';
import { CreateClaim } from '../../../src/module/tickets/application/useCases/create-claim.use-case';
import { UpdateClaim } from '../../../src/module/tickets/application/useCases/update-claim.use-case';
import { ClaimService } from '../../../src/module/tickets/infrastructure/services/claim.service';

describe('ClaimController (unit)', () => {
  let controller: ClaimController;
  let claimService: Partial<ClaimService>;
  let createUseCase: Partial<CreateClaim>;
  let updateUseCase: Partial<UpdateClaim>;

  beforeEach(() => {
    claimService = {
      findAll: jest.fn(),
      findById: jest.fn(),
      delete: jest.fn(),
    } as any;
    createUseCase = { execute: jest.fn() } as any;
    updateUseCase = { execute: jest.fn() } as any;

    controller = new ClaimController(
      claimService as any,
      createUseCase as any,
      updateUseCase as any,
    );
  });

  afterEach(() => jest.resetAllMocks());

  it('create calls CreateClaim use case', async () => {
    const dto: any = { issue: 'x' };
    const user: any = { id: 'u1' };
    (createUseCase.execute as jest.Mock).mockResolvedValue('ok');

    const res = await controller.create(dto, user);
    expect(createUseCase.execute).toHaveBeenCalledWith(dto, user.id);
    expect(res).toBe('ok');
  });

  it('findAll delegates to service', async () => {
    const user: any = { id: 'u1' };
    (claimService.findAll as jest.Mock).mockResolvedValue(['a']);
    const res = await controller.findAll(user);
    expect(claimService.findAll).toHaveBeenCalledWith(user.id);
    expect(res).toEqual(['a']);
  });

  it('findOne delegates to service', async () => {
    const user: any = { id: 'u1' };
    (claimService.findById as jest.Mock).mockResolvedValue({ id: 'c1' });
    const res = await controller.findOne('c1', user);
    expect(claimService.findById).toHaveBeenCalledWith('c1', user.id);
    expect(res).toEqual({ id: 'c1' });
  });

  it('update delegates to UpdateClaim use case', async () => {
    const user: any = { id: 'u1' };
    const dto: any = { issue: 'x' };
    (updateUseCase.execute as jest.Mock).mockResolvedValue('updated');
    const res = await controller.update('c1', dto, user);
    expect(updateUseCase.execute).toHaveBeenCalledWith('c1', dto, user.id);
    expect(res).toBe('updated');
  });

  it('remove calls service.delete and returns deleted true', async () => {
    (claimService.delete as jest.Mock).mockResolvedValue(undefined);
    const res = await controller.remove('c1');
    expect(claimService.delete).toHaveBeenCalledWith('c1');
    expect(res).toEqual({ deleted: true });
  });
});
