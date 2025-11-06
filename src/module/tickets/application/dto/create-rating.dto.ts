import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateRatingDto {
  @IsInt()
  @Min(1)
  @Max(5)
  score!: number;

  @IsUUID()
  categoryId!: string;

  @IsOptional()
  @IsNotEmpty()
  feedback?: string;
}
