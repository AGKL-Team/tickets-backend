import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
// Claim model not required directly in this unit test
import { FirebaseService } from '../../../src/module/core/database/services/firebase.service';
import { Area } from '../../../src/module/tickets/domain/models/area.entity';
import { SubArea } from '../../../src/module/tickets/domain/models/sub-area.entity';
import { AreaFirestoreRepository } from '../../../src/module/tickets/infrastructure/repositories/area.firestore.repository';
import { ClaimFirestoreRepository } from '../../../src/module/tickets/infrastructure/repositories/claim.firestore.repository';
import { SubAreaFirestoreRepository } from '../../../src/module/tickets/infrastructure/repositories/sub-area.firestore.repository';
import { SubAreaService } from '../../../src/module/tickets/infrastructure/services/sub-area.service';
import { SupabaseTestProvider } from '../../shared/providers/supabase-config-test.provider';

describe('SubAreaService', () => {
  let service: SubAreaService;
  let repo: Partial<SubAreaFirestoreRepository>;
  let claimRepo: Partial<ClaimFirestoreRepository>;
  let areaRepo: Partial<AreaFirestoreRepository>;
  let firebase: Partial<FirebaseService>;

  beforeEach(async () => {
    repo = {
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByName: jest.fn(),
    } as any;
    claimRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as any;
    areaRepo = { findAll: jest.fn(), findById: jest.fn() } as any;

    const module = await Test.createTestingModule({
      providers: [
        SubAreaService,
        { provide: SubAreaFirestoreRepository, useValue: repo },
        { provide: ClaimFirestoreRepository, useValue: claimRepo },
        { provide: AreaFirestoreRepository, useValue: areaRepo },
        SupabaseTestProvider,
      ],
    }).compile();

    service = module.get(SubAreaService);
    firebase = module.get(FirebaseService);
  });

  it('findById returns subarea when found', async () => {
    const s = SubArea.create('s', 'desc', Area.create('a'));
    (repo.findById as jest.Mock).mockResolvedValue(s);
    const res = await service.findById('id');
    expect(res).toBe(s);
  });

  it('findById throws NotFound when missing', async () => {
    (repo.findById as jest.Mock).mockRejectedValue(new NotFoundException());
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
    (repo.update as jest.Mock).mockResolvedValue(saved);
    const res = await service.update(s);
    expect(res).toBe(saved);
  });

  it('delete returns boolean', async () => {
    (repo.delete as jest.Mock).mockResolvedValue(true);
    const res = await service.delete('d1');
    expect(res).toBe(true);
  });

  it('findByName throws when missing', async () => {
    (repo.findByName as jest.Mock).mockRejectedValue(new NotFoundException());
    await expect(service.findByName('no')).rejects.toThrow(NotFoundException);
  });

  it('hasClaimsAssociated and hasSubAreas use firebase queries', async () => {
    if (!(firebase as any).queryCollection)
      (firebase as any).queryCollection = jest.fn();
    (firebase.queryCollection as jest.Mock).mockResolvedValue([]);
    const resClaims = await service.hasClaimsAssociated('id');
    expect(firebase.queryCollection).toHaveBeenCalledWith(
      'claims',
      'subArea.id',
      '==',
      'id',
    );
    expect(resClaims).toBe(false);

    (firebase.queryCollection as jest.Mock).mockResolvedValue([1]);
    const resSub = await service.hasSubAreas('a1');
    expect(firebase.queryCollection).toHaveBeenCalledWith(
      'sub_areas',
      'area.id',
      '==',
      'a1',
    );
    expect(resSub).toBe(true);
  });
});
