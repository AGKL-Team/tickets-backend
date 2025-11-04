import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Claim } from '../../../src/module/tickets/domain/models';
import { Area } from '../../../src/module/tickets/domain/models/area.entity';
import { SubArea } from '../../../src/module/tickets/domain/models/sub-area.entity';
import { SubAreaService } from '../../../src/module/tickets/infrastructure/services/sub-area.service';

describe('SubAreaService', () => {
  let service: SubAreaService;
  let repo: Partial<Repository<SubArea>>;
  let claimRepo: Partial<Repository<Claim>>;
  let areaRepo: Partial<Repository<Area>>;

  beforeEach(async () => {
    repo = {
      findOne: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as any;
    claimRepo = { findOne: jest.fn() } as any;
    areaRepo = { findOne: jest.fn(), find: jest.fn() } as any;

    const module = await Test.createTestingModule({
      providers: [
        SubAreaService,
        { provide: getRepositoryToken(SubArea), useValue: repo },
        { provide: getRepositoryToken(Claim), useValue: claimRepo },
        { provide: getRepositoryToken(Area), useValue: areaRepo },
      ],
    }).compile();

    service = module.get(SubAreaService);
  });

  it('findById returns subarea when found', async () => {
    const s = SubArea.create('s', 'desc', Area.create('a'));
    (repo.findOne as jest.Mock).mockResolvedValue(s);
    const res = await service.findById('id');
    expect(res).toBe(s);
  });

  it('findById throws NotFound when missing', async () => {
    (repo.findOne as jest.Mock).mockResolvedValue(null);
    await expect(service.findById('no')).rejects.toThrow(NotFoundException);
  });

  it('save returns saved subarea entity', async () => {
    const s = SubArea.create('s', 'desc', Area.create('a'));
    const saved = { ...(s as any), id: 'new' };
    (repo.save as jest.Mock).mockResolvedValue(saved);
    const res = await service.save(s);
    expect(res).toBe(saved);
  });

  it('update returns entity', async () => {
    const s = SubArea.create('s', 'desc', Area.create('a'));
    const saved = { ...(s as any), id: 'u1' };
    (repo.save as jest.Mock).mockResolvedValue(saved);
    const res = await service.update(s);
    expect(res).toBe(saved);
  });

  it('delete returns boolean', async () => {
    (repo.delete as jest.Mock).mockResolvedValue({ affected: 1 });
    const res = await service.delete('d1');
    expect(res).toBe(true);
  });

  it('findByName throws when missing', async () => {
    (repo.findOne as jest.Mock).mockResolvedValue(null);
    await expect(service.findByName('no')).rejects.toThrow(NotFoundException);
  });
});
