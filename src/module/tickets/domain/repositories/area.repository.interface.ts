import { Area } from '../models';

export interface AreaRepository {
  findById(areaId: string): Promise<Area>;
  findAll(): Promise<Area[]>;
  save(area: Area): Promise<Area>;
  update(area: Area): Promise<Area>;
  delete(areaId: string): Promise<void>;
  findByName(name: string): Promise<Area>;
}
