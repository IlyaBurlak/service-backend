import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Comment, Prisma, Reaction, User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: number,
    data: { comment: string },
  ): Promise<Comment & { user: Omit<User, 'password'>; Reaction: Reaction[] }> {
    const comment = await this.prisma.comment.create({
      data: {
        comment: data.comment,
        user: { connect: { id: userId } },
      },
      include: { user: true, Reaction: true },
    });
    const { password, ...safeUser } = comment.user as unknown as User;
    return { ...comment, user: safeUser as unknown as Omit<User, 'password'> };
  }

  async findAll(): Promise<
    (Comment & { user: Omit<User, 'password'>; Reaction: Reaction[] })[]
  > {
    const comments = await this.prisma.comment.findMany({
      include: { user: true, Reaction: true },
    });
    return comments.map((c) => ({
      ...c,
      user: (({ password, ...rest }) => rest)(
        c.user as unknown as User,
      ) as unknown as Omit<User, 'password'>,
    }));
  }

  async findOne(
    id: number,
  ): Promise<Comment & { user: Omit<User, 'password'>; Reaction: Reaction[] }> {
    const c = await this.prisma.comment.findUnique({
      where: { id },
      include: { user: true, Reaction: true },
    });
    if (!c) throw new NotFoundException('Comment not found');
    const { password, ...safeUser } = c.user as unknown as User;
    return { ...c, user: safeUser as unknown as Omit<User, 'password'> };
  }

  async update(
    id: number,
    requesterId: number,
    data: { comment?: string },
  ): Promise<Comment & { user: Omit<User, 'password'>; Reaction: Reaction[] }> {
    const existing = await this.prisma.comment.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Comment not found');
    if (existing.userId !== requesterId)
      throw new ForbiddenException('Not allowed');
    const comment = await this.prisma.comment.update({
      where: { id },
      data: { comment: data.comment },
      include: { user: true, Reaction: true },
    });
    const { password, ...safeUser } = comment.user as unknown as User;
    return { ...comment, user: safeUser as unknown as Omit<User, 'password'> };
  }

  async remove(id: number, requesterId: number): Promise<{ success: true }> {
    const existing = await this.prisma.comment.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Comment not found');
    if (existing.userId !== requesterId)
      throw new ForbiddenException('Not allowed');
    await this.prisma.comment.delete({ where: { id } });
    return { success: true };
  }
}
