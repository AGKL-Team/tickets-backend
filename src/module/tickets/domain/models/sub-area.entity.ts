import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { Area } from './area.entity';
import { Claim } from './claim.entity';

@Entity('sub_areas')
export class SubArea {
  @ObjectIdColumn()
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ nullable: true })
  area!: Area;

  @Column({ nullable: true })
  claims?: Claim[];

  changeName(name: string) {
    this.name = name.toUpperCase();
  }

  changeDescription(description: string) {
    this.description = description;
  }

  changeArea(area: Area) {
    this.area = area;
  }

  static create(name: string, description: string, area: Area) {
    const subArea = new SubArea();
    subArea.name = name.toUpperCase();
    subArea.description = description;
    subArea.area = area;

    return subArea;
  }
}
