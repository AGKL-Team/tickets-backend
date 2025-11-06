import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Claim } from '../../domain/models';
import { ClaimComment } from '../../domain/models/claim-comment.entity';

@Injectable()
export class ClaimCommentService {
  constructor(
    @InjectRepository(ClaimComment)
    private readonly commentRepository: Repository<ClaimComment>,
    @InjectRepository(Claim)
    private readonly claimRepository: Repository<Claim>,
  ) {}

  async save(entity: ClaimComment): Promise<ClaimComment> {
    return this.commentRepository.save(entity);
  }

  async findById(id: string): Promise<ClaimComment> {
    const c = await this.commentRepository.findOne({ where: { id } });
    if (!c)
      throw new NotFoundException(`No se encuentra el comentario con ID ${id}`);
    return c;
  }

  async findAll(): Promise<ClaimComment[]> {
    return this.commentRepository.find();
  }

  async update(entity: ClaimComment): Promise<ClaimComment> {
    return this.commentRepository.save(entity);
  }

  async delete(id: string): Promise<void> {
    await this.commentRepository.delete(id);
  }

  async hasCommentsForClaim(claimId: string) {
    return this.commentRepository.findOne({
      where: { claim: { id: claimId } },
    });
  }
}
