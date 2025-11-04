import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateSubAreaDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUUID()
  areaId?: string;
}
