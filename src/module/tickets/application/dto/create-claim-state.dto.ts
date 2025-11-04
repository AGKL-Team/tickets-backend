import { IsNotEmpty, IsString } from 'class-validator';

export class CreateClaimStateDto {
  @IsNotEmpty()
  @IsString()
  name!: string;
}
