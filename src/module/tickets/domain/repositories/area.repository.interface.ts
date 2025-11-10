import { Area } from '../models';

export interface AreaRepository {
  findById(areaId: string): Promise<Area>;
  findAll(): Promise<Area[]>;
  save(area: Area): Promise<Area>;
  update(area: Area): Promise<Area>;
  delete(areaId: string): Promise<void>;
  findByName(name: string): Promise<Area>;
  // Link/unlink helpers to maintain bilateral relations (atomic updates)
  addSubAreaId(areaId: string, subAreaId: string): Promise<void>;
  removeSubAreaId(areaId: string, subAreaId: string): Promise<void>;
}
