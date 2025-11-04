import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePriorityDto {
  @IsOptional()
  @IsNumber()
  number?: number;

  @IsOptional()
  @IsString()
  description?: string;
}
