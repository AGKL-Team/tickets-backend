import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Claim } from '../../domain/models';
import { Area } from '../../domain/models/area.entity';
import { SubArea } from '../../domain/models/sub-area.entity';
import { SubAreaRepository } from '../../domain/repositories/sub-area.repository.interface';

@Injectable()
export class SubAreaService implements SubAreaRepository {
  constructor(
    @InjectRepository(SubArea)
    private readonly repo: Repository<SubArea>,
    @InjectRepository(Claim)
    private readonly claimRepository: Repository<Claim>,
    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>,
  ) {}

  async findById(id: string): Promise<SubArea> {
    const sa = await this.repo.findOne({ where: { id }, relations: ['area'] });
    if (!sa)
      throw new NotFoundException(`No se encuentra la subárea con el ID ${id}`);
    return sa;
  }

  async findAll(): Promise<SubArea[]> {
    return this.repo.find({ relations: ['area'] });
  }

  async save(entity: SubArea): Promise<SubArea> {
    const saved = await this.repo.save(entity);
    return saved;
  }

  async update(entity: SubArea): Promise<SubArea> {
    const saved = await this.repo.save(entity);
    return saved;
  }

  async delete(id: string): Promise<boolean> {
    await this.repo.delete(id);
    return true;
  }

  async findByName(name: string): Promise<SubArea> {
    const sa = await this.repo.findOne({
      where: { name },
      relations: ['area'],
    });
    if (!sa)
      throw new NotFoundException(`No se encuentra la subárea '${name}'`);
    return sa;
  }

  async hasClaimsAssociated(id: string) {
    return await this.claimRepository.findOne({ where: { subArea: { id } } });
  }

  async hasSubAreas(areaId: string) {
    return await this.repo.findOne({ where: { area: { id: areaId } } });
  }
}
