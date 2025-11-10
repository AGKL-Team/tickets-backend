import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserArea } from '../../domain/models/user-area.entity';
// There is no dedicated UserAreaRepository interface; keep service as-is

@Injectable()
export class UserAreaService {
  constructor(
    @InjectRepository(UserArea)
    private readonly repo: Repository<UserArea>,
  ) {}

  async save(entity: UserArea): Promise<UserArea> {
    return this.repo.save(entity as any);
  }

  async findByUserId(userId: string): Promise<UserArea[]> {
    return this.repo.find({ where: { userId } as any } as any);
  }

  async findByAreaId(areaId: string): Promise<UserArea[]> {
    return this.repo.find({ where: { 'area.id': areaId } as any } as any);
  }

  async findOne(id: string): Promise<UserArea> {
    const r = await this.repo.findOneBy({ id } as any);
    if (!r)
      throw new NotFoundException(
        `No se encuentra la asociación user-area con ID ${id}`,
      );
    return r;
  }

  async delete(id: string) {
    await this.repo.delete(id as any);
  }
}
