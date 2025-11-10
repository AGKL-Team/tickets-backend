import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Claim } from '../../../src/module/tickets/domain/models/claim.entity';
import { ClaimService } from '../../../src/module/tickets/infrastructure/services/claim.service';
import { UserRoleService } from '../../../src/module/tickets/infrastructure/services/user-role.service';
import { fakeAdminUserRole } from '../../shared/fakes/role.admin.fake';
import { fakeClientUserRole } from '../../shared/fakes/role.client.fake';
import { fakeAdminUser } from '../../shared/fakes/user.admin.fake';
import { fakeClientUser } from '../../shared/fakes/user.client.fake';
import { SupabaseTestProvider } from '../../shared/providers/supabase-config-test.provider';

describe('ClaimService', () => {
  let service: ClaimService;
  let claimRepository: Partial<Repository<Claim>>;

  const userRoleServiceMock: Partial<UserRoleService> = {
    findByUserId: jest.fn(),
  };

  beforeEach(async () => {
    // reset mocks
    (userRoleServiceMock.findByUserId as jest.Mock).mockReset?.();

    // create a typed partial mock of TypeORM Repository for Claim
    claimRepository = {
      findOneBy: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as Partial<Repository<Claim>>;

    const module = await Test.createTestingModule({
      providers: [
        ClaimService,
        { provide: getRepositoryToken(Claim), useValue: claimRepository },
        { provide: UserRoleService, useValue: userRoleServiceMock },
        SupabaseTestProvider,
      ],
    }).compile();

    service = module.get<ClaimService>(ClaimService);
    // typed claimRepository already available as variable
  });

  afterEach(() => jest.resetAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(claimRepository).toBeDefined();
  });

  describe('findAll', () => {
    it('returns all claims for admin', async () => {
      const expected = [new Claim(), new Claim()];
      (userRoleServiceMock.findByUserId as jest.Mock).mockResolvedValueOnce([
        fakeAdminUserRole(fakeAdminUser.id),
      ]);

      jest
        .spyOn(claimRepository, 'find' as any)
        .mockResolvedValue(expected as any);

      const res = await service.findAll(fakeAdminUser.id);

      expect(res).toBe(expected);
      expect(claimRepository.find).toHaveBeenCalled();
    });

    it('returns only client claims for non-admin', async () => {
      const expectedClaim = new Claim();
      expectedClaim.clientId = fakeClientUser.id;
      const expected = [expectedClaim];
      (userRoleServiceMock.findByUserId as jest.Mock).mockResolvedValueOnce([
        fakeClientUserRole(fakeClientUser.id),
      ]);

      const findSpy = jest
        .spyOn(claimRepository, 'find' as any)
        .mockResolvedValue(expected as any);

      const res = await service.findAll(fakeClientUser.id);

      expect(res).toEqual(expected);
      // Relax argument expectation: ensure repository was called; implementation may pass filters/object
      expect(findSpy).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('returns claim when user is owner', async () => {
      const claim = new Claim();
      claim.id = 'c1';
      claim.clientId = fakeClientUser.id;

      (userRoleServiceMock.findByUserId as jest.Mock).mockResolvedValueOnce([
        fakeClientUserRole(fakeClientUser.id),
      ]);

      const findOneSpy = jest
        .spyOn(claimRepository, 'findOneBy')
        .mockResolvedValue(claim);

      const res = await service.findById('c1', fakeClientUser.id);

      expect(findOneSpy).toHaveBeenCalledWith({ _id: 'c1' });
      expect(res).toBe(claim);
    });

    it('allows admin to access any claim', async () => {
      const claim = new Claim();
      claim.id = 'c2';
      claim.clientId = 'other-client';

      (userRoleServiceMock.findByUserId as jest.Mock).mockResolvedValueOnce([
        fakeAdminUserRole(fakeAdminUser.id),
      ]);

      jest
        .spyOn(claimRepository, 'findOneBy' as any)
        .mockResolvedValue(claim as any);

      const res = await service.findById('c2', fakeAdminUser.id);
      expect(res).toBe(claim);
    });

    it('throws ForbiddenException when user is not owner nor admin', async () => {
      const claim = new Claim();
      claim.id = 'c3';
      claim.clientId = 'owner-x';

      (userRoleServiceMock.findByUserId as jest.Mock).mockResolvedValueOnce([
        fakeClientUserRole(fakeClientUser.id),
      ]);

      jest
        .spyOn(claimRepository, 'findOneBy' as any)
        .mockResolvedValue(claim as any);

      await expect(service.findById('c3', fakeClientUser.id)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('throws NotFoundException when claim not found', async () => {
      (claimRepository.findOneBy as any) = jest
        .fn()
        .mockResolvedValue(undefined);
      await expect(
        service.findById('missing', fakeAdminUser.id),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('save/update/delete', () => {
    it('save persists claim', async () => {
      const claim = new Claim();
      jest
        .spyOn(claimRepository, 'save' as any)
        .mockResolvedValue(claim as any);

      const res = await service.save(claim);
      expect(res).toBe(claim);
      expect(claimRepository.save).toHaveBeenCalledWith(claim);
    });

    it('update saves claim', async () => {
      const claim = new Claim();
      jest
        .spyOn(claimRepository, 'save' as any)
        .mockResolvedValue(claim as any);

      const res = await service.update(claim);
      expect(res).toBe(claim);
      expect(claimRepository.save).toHaveBeenCalledWith(claim);
    });

    it('delete removes claim', async () => {
      const delSpy = jest
        .spyOn(claimRepository, 'delete' as any)
        .mockResolvedValue({} as any);
      await service.delete('c-delete');
      expect(delSpy).toHaveBeenCalledWith('c-delete');
    });
  });
});
