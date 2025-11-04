import {
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateClaimDto {
  @IsNotEmpty()
  @IsString()
  issue!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsISO8601()
  date?: string;

  @IsUUID()
  priorityId: string;

  @IsUUID()
  categoryId: string;

  @IsUUID()
  areaId: string;
}
