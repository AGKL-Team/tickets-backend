import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_areas')
export class UserArea {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  userId!: string;

  @Column()
  areaId!: string;

  static create(userId: string, areaId: string) {
    const ua = new UserArea();
    ua.userId = userId;
    ua.areaId = areaId;
    return ua;
  }
}
