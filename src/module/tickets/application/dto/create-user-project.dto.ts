import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserProjectDto {
  @IsNotEmpty()
  @IsString()
  userId!: string;
}
