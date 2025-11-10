import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity('user_projects')
export class UserProject {
  @ObjectIdColumn()
  id!: string;

  // Supabase user id (uuid string)
  @Column()
  userId!: string;

  // Project id (stored as string pointing to Project.id)
  @Column()
  projectId!: string;

  static create(userId: string, projectId: string) {
    const up = new UserProject();
    up.userId = userId;
    up.projectId = projectId;
    return up;
  }
}
