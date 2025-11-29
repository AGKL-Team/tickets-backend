import { IsString, IsOptional } from 'class-validator';

export class UpdateUserProfileDto {
  @IsOptional()
  @IsString()
  nombre?: string;
}