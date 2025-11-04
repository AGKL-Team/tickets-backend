import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateClaimCancellationDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}
