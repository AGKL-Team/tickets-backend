import { IsISO8601, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateClaimDto {
  @IsOptional()
  @IsString()
  issue?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsISO8601()
  date?: string;

  @IsOptional()
  @IsUUID()
  priorityId?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsUUID()
  areaId?: string;
}
