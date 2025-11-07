import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role.entity';

@Entity({ name: 'user_roles' })
export class UserRole {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  @Index()
  userId!: string; // Supabase user id reference

  @ManyToOne(() => Role, (role) => role.userRoles, { eager: true })
  role!: Role;

  @CreateDateColumn()
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
