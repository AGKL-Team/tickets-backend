import { IsOptional, IsString } from 'class-validator';

export class UpdateClaimStateDto {
  @IsOptional()
  @IsString()
  name?: string;
}
