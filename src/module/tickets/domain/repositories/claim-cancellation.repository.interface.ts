import { ClaimCancellation } from '../models/claim-cancellation.entity';

export interface ClaimCancellationRepository {
  create(entity: ClaimCancellation): Promise<ClaimCancellation>;
  findById(id: string): Promise<ClaimCancellation>;
  findAll(): Promise<ClaimCancellation[]>;
  update(entity: ClaimCancellation): Promise<ClaimCancellation>;
  delete(id: string): Promise<void>;
}
