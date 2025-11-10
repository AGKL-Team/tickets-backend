import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { Area } from './area.entity';

@Entity('user_areas')
export class UserArea {
  @ObjectIdColumn()
  id!: string;

  @Column()
  userId!: string;

  @Column({ nullable: true })
  area!: Area;

  static create(userId: string, area: Area) {
    const ua = new UserArea();
    ua.userId = userId;
    ua.area = area;
    return ua;
  }
}
