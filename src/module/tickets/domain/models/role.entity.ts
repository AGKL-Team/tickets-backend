import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from './user-role.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar', { unique: true })
  name!: string;

  @OneToMany(() => UserRole, (userRole) => userRole.role)
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

  isAreaManager(): boolean {
    return (
      this.name?.toLowerCase() === 'area_manager' ||
      this.name?.toLowerCase() === 'area-manager' ||
      this.name?.toLowerCase() === 'area manager'
    );
  }

  isResolver(): boolean {
    return (
      this.name?.toLowerCase() === 'resolver' ||
      this.name?.toLowerCase() === 'agent' ||
      this.name?.toLowerCase() === 'resolutor'
    );
  }

  static create(name: 'admin' | 'client'): Role {
    const role = new Role();
    role.name = name;
    return role;
  }
}
