import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Area } from '../../../src/module/tickets/domain/models/area.entity';
import { Claim } from '../../../src/module/tickets/domain/models/claim.entity';
import { SubArea } from '../../../src/module/tickets/domain/models/sub-area.entity';
import { SubAreaService } from '../../../src/module/tickets/infrastructure/services/sub-area.service';
import { SupabaseTestProvider } from '../../shared/providers/supabase-config-test.provider';

describe('SubAreaService', () => {
  let service: SubAreaService;
  let repo: Partial<Repository<SubArea>>;
  let claimRepo: Partial<Repository<Claim>>;

  beforeEach(async () => {
    repo = {
      findOneBy: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      findOne: jest.fn(),
    } as Partial<Repository<SubArea>>;
    claimRepo = {
      findOneBy: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as Partial<Repository<Claim>>;

    const module = await Test.createTestingModule({
      providers: [
        SubAreaService,
        { provide: getRepositoryToken(SubArea), useValue: repo },
        { provide: getRepositoryToken(Claim), useValue: claimRepo },
        SupabaseTestProvider,
      ],
    }).compile();

    service = module.get(SubAreaService);
  });

  it('findById returns subarea when found', async () => {
    const s = SubArea.create('s', 'desc', Area.create('a'));
    (repo.findOneBy as jest.Mock).mockResolvedValue(s);
    const res = await service.findById('id');
    expect(res).toBe(s);
  });

  it('findById throws NotFound when missing', async () => {
    (repo.findOneBy as jest.Mock).mockRejectedValue(new NotFoundException());
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
    (repo.delete as jest.Mock).mockResolvedValue(true);
    const res = await service.delete('d1');
    expect(res).toBe(true);
  });

  it('findByName throws when missing', async () => {
    (repo.findOne as jest.Mock).mockRejectedValue(new NotFoundException());
    await expect(service.findByName('no')).rejects.toThrow(NotFoundException);
  });
  it('hasClaimsAssociated and hasSubAreas use repository queries', async () => {
    (claimRepo.findOneBy as jest.Mock).mockResolvedValue(undefined);
    const resClaims = await service.hasClaimsAssociated('id');
    expect(claimRepo.findOneBy).toHaveBeenCalledWith({ subArea: { id: 'id' } });
    expect(resClaims).toBe(false);

    (repo.findOneBy as jest.Mock).mockResolvedValue({} as any);
    const resSub = await service.hasSubAreas('a1');
    expect(repo.findOneBy).toHaveBeenCalledWith({ area: { id: 'a1' } });
    expect(resSub).toBe(true);
  });
});
