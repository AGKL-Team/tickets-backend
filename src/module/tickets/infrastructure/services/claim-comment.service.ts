import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClaimComment } from '../../domain/models/claim-comment.entity';

@Injectable()
export class ClaimCommentService {
  constructor(
    @InjectRepository(ClaimComment)
    private readonly commentRepository: Repository<ClaimComment>,
  ) {}

  async save(entity: ClaimComment): Promise<ClaimComment> {
    return this.commentRepository.save(entity as any);
  }

  async findById(id: string): Promise<ClaimComment> {
    const c = await this.commentRepository.findOneBy({ id } as any);
    if (!c)
      throw new NotFoundException(`No se encuentra el comentario con ID ${id}`);
    return c;
  }

  async findAll(): Promise<ClaimComment[]> {
    return this.commentRepository.find();
  }

  async update(entity: ClaimComment): Promise<ClaimComment> {
    return this.commentRepository.save(entity as any);
  }

  async delete(id: string): Promise<void> {
    await this.commentRepository.delete(id as any);
  }

  async hasCommentsForClaim(claimId: string) {
    return this.commentRepository.findOneBy({ 'claim.id': claimId } as any);
  }
}
