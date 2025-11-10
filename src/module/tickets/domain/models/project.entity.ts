import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { Area } from './area.entity';
import { Claim } from './claim.entity';

@Entity('projects')
export class Project {
  @ObjectIdColumn()
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  areas?: Area[];

  @Column({ nullable: true })
  claims?: Claim[];

  changeName(name: string) {
    this.name = name.toUpperCase();
  }

  changeDescription(description: string) {
    this.description = description;
  }

  addArea(area: Area) {
    if (!this.areas) this.areas = [];
    if (this.areas.some((a) => a.name === area.name)) {
      throw new Error(
        `Ya existe un área con el nombre '${area.name}' en el proyecto '${this.name}'`,
      );
    }
    this.areas.push(area);
  }

  removeArea(area: Area) {
    if (!this.areas) return;
    this.areas = this.areas.filter((a) => a.id !== area.id);
  }
}
