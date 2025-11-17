import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role.entity';

@Entity('user_roles')
export class UserRole {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  userId!: string; // Supabase user id reference

  @ManyToOne(() => Role, (role) => role.userRoles, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({ name: 'roleId' })
  role!: Role;

  @Column('timestamptz', { default: () => 'CURRENT_TIMESTAMP', nullable: true })
  createdAt!: Date;

  isAdmin(): boolean {
    return this.role.isAdmin();
  }

  isClient(): boolean {
    return this.role.isClient();
  }

  isAreaManager(): boolean {
    return this.role.isAreaManager();
  }

  isResolver(): boolean {
    return this.role.isResolver();
  }

  static create(userId: string, role: Role): UserRole {
    const userRole = new UserRole();
    userRole.userId = userId;
    userRole.role = role;
    userRole.createdAt = new Date();

    return userRole;
  }
}
