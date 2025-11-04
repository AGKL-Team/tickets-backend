import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateUserRoleDto {
  @IsNotEmpty()
  @IsString()
  userId!: string; // Supabase user id (uuid string)

  @IsNotEmpty()
  @IsUUID()
  roleId!: string;
}
