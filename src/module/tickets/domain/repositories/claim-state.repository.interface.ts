import { ClaimState } from '../models/claim-state.entity';

export interface ClaimStateRepository {
  create(entity: ClaimState): Promise<ClaimState>;
  findById(id: string): Promise<ClaimState>;
  findAll(): Promise<ClaimState[]>;
  update(entity: ClaimState): Promise<ClaimState>;
  delete(id: string): Promise<void>;
}
