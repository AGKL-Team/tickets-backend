import { IsInt, IsNotEmpty, IsOptional, Max, Min } from 'class-validator';

export class UpdateRatingDto {
  @IsInt()
  @Min(1)
  @Max(5)
  score!: number;

  @IsOptional()
  @IsNotEmpty()
  feedback?: string;
}
