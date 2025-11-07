import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Area } from './area.entity';
import { Claim } from './claim.entity';

@Entity({ name: 'subareas' })
export class SubArea {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 50 })
  name!: string;
  @Column({ length: 255, default: '', nullable: true })
  description!: string;

  @ManyToOne(() => Area, (area) => area.subAreas)
  area!: Area;

  @OneToMany(() => Claim, (claim) => claim.subArea)
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
