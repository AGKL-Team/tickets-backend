import { IsOptional, IsString } from 'class-validator';

export class UpdateClaimCancellationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
