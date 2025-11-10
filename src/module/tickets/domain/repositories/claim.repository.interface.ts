import { Claim } from '../models/claim.entity';

export interface ClaimRepository {
  save(entity: Claim): Promise<Claim>;
  findById(id: string, userId: string, projectId?: string): Promise<Claim>;
  findAll(userId: string, projectId?: string): Promise<Claim[]>;
  update(entity: Claim): Promise<Claim>;
  delete(id: string): Promise<void>;
}
