import { BadRequestException } from '@nestjs/common';
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { Claim } from './claim.entity';
import { Project } from './project.entity';
import { SubArea } from './sub-area.entity';

@Entity('areas')
export class Area {
  @ObjectIdColumn()
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  claims?: Claim[];

  @Column({ nullable: true })
  subAreas: SubArea[] = [];

  @Column({ nullable: true })
  project?: Project;

  // Users are stored in a different datasource (Postgres via Supabase).
  // We do not keep a TypeORM relation here to avoid cross-datasource relations.
  // Use `UserAreaService` to query assignments by area id when needed.

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

  static create(name: string, description?: string, project?: Project): Area {
    const a = new Area();
    a.name = name.toUpperCase();
    a.description = description;
    if (project) a.project = project;
    return a;
  }
}
