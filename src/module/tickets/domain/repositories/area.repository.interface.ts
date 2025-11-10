import { Area } from '../models';

export interface AreaRepository {
  findById(areaId: string, projectId?: string): Promise<Area>;
  findAll(projectId?: string): Promise<Area[]>;
  save(area: Area): Promise<Area>;
  update(area: Area): Promise<Area>;
  delete(areaId: string): Promise<void>;
  findByName(name: string): Promise<Area>;
  /**
   * Find an area by name scoped to a project. If projectId is undefined/null
   * the search will be performed among areas without a project (global areas).
   * Returns null when not found.
   */
  findByNameInProject(name: string, projectId?: string): Promise<Area | null>;
}
