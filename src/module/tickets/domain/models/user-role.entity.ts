import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { Role } from './role.entity';

@Entity('user_roles')
export class UserRole {
  @ObjectIdColumn()
  id!: string;

  @Column()
  userId!: string; // Supabase user id reference

  @Column({ nullable: true })
  role!: Role;

  @Column({ nullable: true })
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
