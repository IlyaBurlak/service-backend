import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Reaction } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, data: { type: string; commentId?: number | null }): Promise<Reaction> {
    return this.prisma.reaction.create({
      data: {
        type: data.type,
        user: { connect: { id: userId } },
        ...(data.commentId ? { comment: { connect: { id: data.commentId } } } : {}),
      },
    });
  }

  async findAll(filter?: { commentId?: number }): Promise<Reaction[]> {
    return this.prisma.reaction.findMany({
      where: {
        ...(filter?.commentId ? { commentId: filter.commentId } : {}),
      },
    });
  }

  async update(id: number, requesterId: number, data: { type?: string }): Promise<Reaction> {
    const existing = await this.prisma.reaction.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Reaction not found');
    if (existing.userId !== requesterId) throw new ForbiddenException('Not allowed');
    return this.prisma.reaction.update({ where: { id }, data: { type: data.type } });
  }

  async remove(id: number, requesterId: number): Promise<{ success: true }>{
    const existing = await this.prisma.reaction.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Reaction not found');
    if (existing.userId !== requesterId) throw new ForbiddenException('Not allowed');
    await this.prisma.reaction.delete({ where: { id } });
    return { success: true };
  }
}


