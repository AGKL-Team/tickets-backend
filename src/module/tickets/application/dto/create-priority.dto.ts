import { IsNumber, IsString, Min } from 'class-validator';

export class CreatePriorityDto {
  @IsNumber()
  @Min(0, { message: 'El número debe ser un entero positivo' })
  number!: number;

  @IsString()
  description?: string;
}
