import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Area } from '../../../src/module/tickets/domain/models/area.entity';
import { Claim } from '../../../src/module/tickets/domain/models/claim.entity';
import { AreaService } from '../../../src/module/tickets/infrastructure/services/area.service';
import { SupabaseTestProvider } from '../../shared/providers/supabase-config-test.provider';

describe('AreaService', () => {
  let service: AreaService;
  let repo: any;
  let claimRepo: any;

  beforeEach(async () => {
    repo = {
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      findByName: jest.fn(),
    };

    claimRepo = {
      findOneBy: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        AreaService,
        { provide: getRepositoryToken(Area), useValue: repo },
        { provide: getRepositoryToken(Claim), useValue: claimRepo },
        SupabaseTestProvider,
      ],
    }).compile();

    service = module.get(AreaService);
  });

  it('findById returns area when found', async () => {
    const a = Area.create('test');
    (repo.findById as jest.Mock).mockResolvedValue(a);
    const res = await service.findById('id1');
    expect(res).toBe(a);
  });

  it('findById throws NotFound when missing', async () => {
    (repo.findById as jest.Mock).mockRejectedValue(new NotFoundException());
    await expect(service.findById('no')).rejects.toThrow(NotFoundException);
  });

  it('findAll returns list', async () => {
    const list = [Area.create('a1')];
    (repo.findAll as jest.Mock).mockResolvedValue(list);
    const res = await service.findAll();
    expect(res).toBe(list);
  });

  it('save returns created area', async () => {
    const a = Area.create('n');
    (repo.save as jest.Mock).mockResolvedValue(a);
    const res = await service.save(a);
    expect(res).toBe(a);
  });

  it('findByName returns area when exists', async () => {
    const a = Area.create('X');
    (repo.findByName as jest.Mock).mockResolvedValue(a);
    const res = await service.findByName('X');
    expect(res).toBe(a);
  });

  it('findByName throws when not found', async () => {
    (repo.findByName as jest.Mock).mockRejectedValue(new NotFoundException());
    await expect(service.findByName('no')).rejects.toThrow(NotFoundException);
  });

  it('hasClaimsAssociated queries claim repository', async () => {
    (claimRepo.findOneBy as jest.Mock).mockResolvedValue(undefined);
    const res = await service.hasClaimsAssociated('id');
    expect(claimRepo.findOneBy).toHaveBeenCalledWith({ 'area.id': 'id' });
    expect(res).toBe(false);
  });
});
