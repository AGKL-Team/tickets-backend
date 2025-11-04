import { BadRequestException } from '@nestjs/common';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Claim } from './claim.entity';
import { SubArea } from './sub-area.entity';

@Entity({ name: 'areas' })
export class Area {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @OneToMany(() => Claim, (claim) => claim.area)
  claims?: Claim[];

  @OneToMany(() => SubArea, (subarea) => subarea.area)
  subAreas: SubArea[];

  changeName(name: string) {
    this.name = name.toUpperCase();
  }

  changeDescription(description: string) {
    this.description = description;
  }

  addSubArea(subArea: SubArea) {
    // ensure the array is defined
    if (!this.subAreas) {
      this.subAreas = [];
    }

    // ensure the subArea's name is unique in this area
    if (this.subAreas.some((s) => s.name === subArea.name)) {
      throw new BadRequestException(
        `Ya existe una sub área con el nombre '${subArea.name}' en el área '${this.name}'`,
      );
    }

    // add sub area to the area
    this.subAreas.push(subArea);
  }

  static create(name: string, description?: string): Area {
    const a = new Area();
    a.name = name.toUpperCase();
    a.description = description;
    return a;
  }
}
