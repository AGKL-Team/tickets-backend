import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { Claim } from './claim.entity';

@Entity('claim_categories')
export class ClaimCategory {
  @ObjectIdColumn()
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
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
