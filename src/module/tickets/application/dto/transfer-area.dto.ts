import { IsNotEmpty, IsUUID } from 'class-validator';

export class TransferAreaDto {
  @IsUUID()
  @IsNotEmpty()
  areaId!: string;
}
