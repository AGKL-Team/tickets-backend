import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Area } from './area.entity';

@Entity({ name: 'user_areas' })
export class UserArea {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @ManyToOne(() => Area, (a) => a.id, { eager: true })
  area!: Area;

  static create(userId: string, area: Area) {
    const ua = new UserArea();
    ua.userId = userId;
    ua.area = area;
    return ua;
  }
}
