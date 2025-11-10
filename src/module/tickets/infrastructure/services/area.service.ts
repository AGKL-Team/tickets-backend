import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Area } from '../../domain/models/area.entity';
import { Claim } from '../../domain/models/claim.entity';
import { SubArea } from '../../domain/models/sub-area.entity';
import { AreaRepository } from '../../domain/repositories/area.repository.interface';

@Injectable()
export class AreaService implements AreaRepository {
  constructor(
    @InjectRepository(Area)
    private readonly repo: Repository<Area>,
    @InjectRepository(Claim)
    private readonly claimRepo: Repository<Claim>,
  ) {}

  async findById(id: string): Promise<Area> {
    const a = await this.repo.findOneBy({ id } as any);
    if (!a) throw new NotFoundException(`No se encuentra el área con ID ${id}`);
    return a;
  }

  async findAll(): Promise<Area[]> {
    return this.repo.find();
  }

  async save(entity: Area): Promise<Area> {
    return this.repo.save(entity as any);
  }

  async update(area: Area): Promise<Area> {
    return this.repo.save(area as any);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id as any);
  }

  async findByName(name: string): Promise<Area> {
    const a = await this.repo.findOneBy({ name } as any);
    if (!a)
      throw new NotFoundException(`No se encuentra el área con nombre ${name}`);
    return a;
  }

  async addSubAreaId(areaId: string, subAreaId: string): Promise<void> {
    const area = await this.repo.findOneBy({ id: areaId } as any);
    if (!area)
      throw new NotFoundException(`No se encuentra el área con ID ${areaId}`);
    if (!area.subAreas) area.subAreas = [];
    const sa = new SubArea();
    sa.id = subAreaId;
    area.subAreas.push(sa);
    await this.repo.save(area as any);
  }

  async removeSubAreaId(areaId: string, subAreaId: string): Promise<void> {
    const area = await this.repo.findOneBy({ id: areaId } as any);
    if (!area)
      throw new NotFoundException(`No se encuentra el área con ID ${areaId}`);
    if (!area.subAreas) return;
    area.subAreas = area.subAreas.filter((s) => s.id !== subAreaId);
    await this.repo.save(area as any);
  }

  async hasClaimsAssociated(id: string) {
    const c = await this.claimRepo.findOneBy({ 'area.id': id } as any);
    return !!c;
  }
}
