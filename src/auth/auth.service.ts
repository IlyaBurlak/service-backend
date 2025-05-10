import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import { LoginResponse } from '../types';

interface LoginPayload {
  email: string;
  sub: number;
}

interface AuthUser {
  id: number;
  email: string;
  name: string;
  surname: string;
  isGuest: boolean;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<AuthUser> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...safeUser } = user;
    return safeUser as AuthUser;
  }

  async login(user: AuthUser): Promise<{ access_token: string }> {
    const payload: LoginPayload = {
      email: user.email,
      sub: user.id,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(
    userData: Prisma.UserCreateInput,
  ): Promise<Omit<User, 'password'>> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        isGuest: false,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  async registerGuest(): Promise<
    LoginResponse & { name: string; surname: string }
  > {
    const randomId = Math.floor(Math.random() * 1000000);
    const guestEmail = `guest_${randomId}@example.com`;
    const randomPassword = Math.random().toString(36).slice(-8);

    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    const user = await this.prisma.user.create({
      data: {
        email: guestEmail,
        password: hashedPassword,
        name: 'Гость',
        surname: '',
        isGuest: true,
      },
    });

    const payload = {
      email: user.email,
      sub: user.id,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      name: user.name,
      surname: user.surname,
    };
  }

  async cleanupExpiredGuests(): Promise<void> {
    const expirationLimit = 24 * 60 * 60 * 1000;
    const now = new Date();

    await this.prisma.user.deleteMany({
      where: {
        isGuest: true,
        createdAt: {
          lte: new Date(now.getTime() - expirationLimit),
        },
      },
    });
  }

  async getMe(userId: number): Promise<Omit<User, 'password'> | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }
}
