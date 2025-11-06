import { IsNotEmpty, IsUUID } from 'class-validator';

export class AssignSubAreaDto {
  @IsUUID()
  @IsNotEmpty()
  subAreaId!: string;
}
