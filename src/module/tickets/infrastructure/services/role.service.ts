import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SupabaseService } from '../../../core/database/services/supabase.service';
import { Role } from '../../domain/models/role.entity';
import { RoleRepository } from '../../domain/repositories/role.repository.interface';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService implements RoleRepository {
  constructor(
    private readonly supabaseService: SupabaseService,
    @InjectRepository(Role, 'postgresConnection')
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(entity: Role): Promise<Role> {
    const client = this.supabaseService.getClient();
    const resp: any = await client
      .from('roles')
      .insert({ name: entity.name })
      .select()
      .single();
    if (resp.error)
      throw new BadRequestException(resp.error.message || resp.error);
    return resp.data as Role;
  }

  async findById(id: string): Promise<Role> {
    const client = this.supabaseService.getClient();
    const resp: any = await client
      .from('roles')
      .select('*')
      .eq('id', id)
      .single();
    if (resp.error)
      throw new NotFoundException(`No se encuentra el rol con ID ${id}`);
    if (!resp.data)
      throw new NotFoundException(`No se encuentra el rol con ID ${id}`);
    return resp.data as Role;
  }

  async findAll(): Promise<Role[]> {
    const client = this.supabaseService.getClient();
    const resp: any = await client.from('roles').select('*');
    if (resp.error)
      throw new BadRequestException(resp.error.message || resp.error);
    return resp.data as Role[];
  }

  async update(entity: Role): Promise<Role> {
    const client = this.supabaseService.getClient();
    const resp: any = await client
      .from('roles')
      .update({ name: entity.name })
      .eq('id', entity.id)
      .select()
      .single();
    if (resp.error)
      throw new BadRequestException(resp.error.message || resp.error);
    return resp.data as Role;
  }

  async delete(id: string): Promise<void> {
    const client = this.supabaseService.getClient();
    const resp: any = await client.from('roles').delete().eq('id', id);
    if (resp.error)
      throw new BadRequestException(resp.error.message || resp.error);
  }
}
