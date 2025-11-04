import { ClaimCategory } from '../models/claim-category.entity';

export interface ClaimCategoryRepository {
  create(entity: ClaimCategory): Promise<ClaimCategory>;
  findById(id: string): Promise<ClaimCategory>;
  findAll(): Promise<ClaimCategory[]>;
  update(entity: ClaimCategory): Promise<ClaimCategory>;
  delete(id: string): Promise<void>;
}
