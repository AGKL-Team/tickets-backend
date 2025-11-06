import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Area } from './area.entity';
import { Claim } from './claim.entity';

@Entity({ name: 'projects' })
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @OneToMany(() => Area, (a) => a.project)
  areas?: Area[];

  @OneToMany(() => Claim, (c) => c.project)
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
