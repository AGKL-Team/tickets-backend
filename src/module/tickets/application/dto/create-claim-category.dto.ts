import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateClaimCategoryDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}
