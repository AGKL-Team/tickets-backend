import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Claim } from '../../../src/module/tickets/domain/models';
import { Area } from '../../../src/module/tickets/domain/models/area.entity';
import { AreaService } from '../../../src/module/tickets/infrastructure/services/area.service';

describe('AreaService', () => {
  let service: AreaService;
  let repo: Partial<Repository<Area>>;
  let claimRepo: Partial<Repository<Claim>>;

  beforeEach(async () => {
    repo = {
      findOne: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as any;

    claimRepo = { findOne: jest.fn() } as any;

    const module = await Test.createTestingModule({
      providers: [
        AreaService,
        { provide: getRepositoryToken(Area), useValue: repo },
        { provide: getRepositoryToken(Claim), useValue: claimRepo },
      ],
    }).compile();

    service = module.get(AreaService);
  });

  it('findById returns area when found', async () => {
    const a = Area.create('test');
    (repo.findOne as jest.Mock).mockResolvedValue(a);
    const res = await service.findById('id1');
    expect(res).toBe(a);
  });

  it('findById throws NotFound when missing', async () => {
    (repo.findOne as jest.Mock).mockResolvedValue(null);
    await expect(service.findById('no')).rejects.toThrow(NotFoundException);
  });

  it('findAll returns list', async () => {
    const list = [Area.create('a1')];
    (repo.find as jest.Mock).mockResolvedValue(list);
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
    (repo.findOne as jest.Mock).mockResolvedValue(a);
    const res = await service.findByName('X');
    expect(res).toBe(a);
  });

  it('findByName throws when not found', async () => {
    (repo.findOne as jest.Mock).mockResolvedValue(null);
    await expect(service.findByName('no')).rejects.toThrow(NotFoundException);
  });

  it('hasClaimsAssociated queries claim repository', async () => {
    (claimRepo.findOne as jest.Mock).mockResolvedValue(null);
    const res = await service.hasClaimsAssociated('id');
    expect(claimRepo.findOne).toHaveBeenCalled();
    expect(res).toBeNull();
  });
});
