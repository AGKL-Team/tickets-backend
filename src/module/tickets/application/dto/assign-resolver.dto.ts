import { IsNotEmpty, IsUUID } from 'class-validator';

export class AssignResolverDto {
  @IsUUID()
  @IsNotEmpty()
  resolverId!: string;
}
