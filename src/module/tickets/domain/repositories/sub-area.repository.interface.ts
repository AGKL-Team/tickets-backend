import { SubArea } from '../models/sub-area.entity';

export interface SubAreaRepository {
  findById(subAreaId: string, projectId?: string): Promise<SubArea>;
  findAll(projectId?: string): Promise<SubArea[]>;
  save(subArea: SubArea): Promise<SubArea>;
  update(subArea: SubArea): Promise<SubArea>;
  delete(subAreaId: string): Promise<boolean>;
  findByName(name: string): Promise<SubArea | null>;
}
