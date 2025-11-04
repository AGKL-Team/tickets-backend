import { IsOptional, IsString } from 'class-validator';

export class UpdateClaimCategoryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
