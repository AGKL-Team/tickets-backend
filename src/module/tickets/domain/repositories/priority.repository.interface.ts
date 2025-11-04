import { Priority } from '../models/priority.entity';

export interface PriorityRepository {
  save(entity: Priority): Promise<Priority>;
  findById(id: string): Promise<Priority>;
  findAll(): Promise<Priority[]>;

  /**
   *
   * @param entity
   */
  update(entity: Priority): Promise<Priority>;

  /**
   *
   * @param id
   */
  delete(id: string): Promise<void>;

  /**
   * Find a priority using the number
   * @param number New priority's number
   */
  findByNumber(number: number);
}
