import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from './user-role.entity';

@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;

  @OneToMany(() => UserRole, (ur) => ur.role)
  userRoles?: UserRole[];

  changeName(name: string) {
    this.name = name;
  }

  isClient(): boolean {
    return (
      this.name?.toLowerCase() === 'client' ||
      this.name?.toLowerCase() === 'user'
    );
  }

  isAdmin(): boolean {
    return (
      this.name?.toLowerCase() === 'admin' ||
      this.name?.toLowerCase() === 'administrator'
    );
  }

  static create(name: 'admin' | 'client'): Role {
    const role = new Role();
    role.name = name;
    return role;
  }
}
