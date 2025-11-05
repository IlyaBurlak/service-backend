import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.prisma.user.findMany();
    return users.map(({ password, ...u }) => u);
  }

  async findOne(id: number): Promise<Omit<User, 'password'>> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    const { password, ...safe } = user;
    return safe;
  }

  async create(data: Prisma.UserCreateInput): Promise<Omit<User, 'password'>> {
    // This is an admin-like endpoint; passwords should be hashed elsewhere if used.
    const user = await this.prisma.user.create({ data });
    const { password, ...safe } = user;
    return safe;
  }

  async update(id: number, requesterId: number, data: Prisma.UserUpdateInput): Promise<Omit<User, 'password'>> {
    if (id !== requesterId) {
      throw new ForbiddenException('You can only update your own profile');
    }
    const user = await this.prisma.user.update({ where: { id }, data });
    const { password, ...safe } = user;
    return safe;
  }

  async remove(id: number, requesterId: number): Promise<{ success: true }>{
    if (id !== requesterId) {
      throw new ForbiddenException('You can only delete your own account');
    }
    await this.prisma.user.delete({ where: { id } });
    return { success: true };
  }
}


