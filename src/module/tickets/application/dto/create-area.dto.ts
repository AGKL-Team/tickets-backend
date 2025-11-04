import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAreaDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}
