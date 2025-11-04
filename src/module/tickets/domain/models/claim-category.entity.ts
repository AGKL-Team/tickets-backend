import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Claim } from './claim.entity';

@Entity({ name: 'claim_categories' })
export class ClaimCategory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @OneToMany(() => Claim, (claim) => claim.category)
  claims?: Claim[];

  changeName(name: string) {
    this.name = name;
  }

  changeDescription(description: string) {
    this.description = description;
  }

  static create(name: string, description?: string): ClaimCategory {
    const category = new ClaimCategory();
    category.name = name;
    category.description = description;

    return category;
  }
}
