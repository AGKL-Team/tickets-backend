import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateSubAreaDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUUID()
  areaId!: string;
}
