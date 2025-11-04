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

  isAdmin(): unknown {
    return this.role.isAdmin();
  }

  isClient() {
    return this.role.isClient();
  }

  static create(userId: string, role: Role): UserRole {
    const userRole = new UserRole();
    userRole.userId = userId;
    userRole.role = role;
    userRole.createdAt = new Date();

    return userRole;
  }
}
