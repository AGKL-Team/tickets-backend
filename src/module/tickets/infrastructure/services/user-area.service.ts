import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserArea } from '../../domain/models/user-area.entity';

@Injectable()
export class UserAreaService {
  constructor(
    @InjectRepository(UserArea)
    private readonly repo: Repository<UserArea>,
  ) {}

  async save(entity: UserArea): Promise<UserArea> {
    return this.repo.save(entity);
  }

  async findByUserId(userId: string): Promise<UserArea[]> {
    return this.repo.find({ where: { userId }, relations: { area: true } });
  }

  async findByAreaId(areaId: string): Promise<UserArea[]> {
    return this.repo.find({
      where: { area: { id: areaId } },
      relations: { area: true },
    });
  }

  async findOne(id: string): Promise<UserArea> {
    const u = await this.repo.findOne({
      where: { id },
      relations: { area: true },
    });
    if (!u)
      throw new NotFoundException(
        `No se encuentra la asignación usuario-área con ID ${id}`,
      );
    return u;
  }

  async delete(id: string) {
    await this.repo.delete(id);
  }
}
