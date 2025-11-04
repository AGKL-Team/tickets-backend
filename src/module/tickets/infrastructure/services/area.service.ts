import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Claim } from '../../domain/models';
import { AreaRepository } from '../../domain/repositories/area.repository.interface';
import { Area } from './../../domain/models/area.entity';

@Injectable()
export class AreaService implements AreaRepository {
  constructor(
    @InjectRepository(Area)
    private readonly repo: Repository<Area>,
    @InjectRepository(Claim)
    private readonly claimRepository: Repository<Claim>,
  ) {}

  async findById(id: string): Promise<Area> {
    const area = await this.repo.findOne({ where: { id } });
    if (!area)
      throw new NotFoundException(`No se encuentra el área con el ID ${id}`);
    return area;
  }

  async findAll(): Promise<Area[]> {
    return this.repo.find();
  }

  async save(entity: Area): Promise<Area> {
    return await this.repo.save(entity);
  }

  async update(area: Area): Promise<Area> {
    return await this.repo.save(area);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async findByName(name: string): Promise<Area> {
    const area = await this.repo.findOne({ where: { name } });
    if (!area) throw new NotFoundException(`No se encuentra el área '${name}'`);
    return area;
  }

  async hasClaimsAssociated(id: string) {
    return await this.claimRepository.findOne({ where: { area: { id } } });
  }
}
