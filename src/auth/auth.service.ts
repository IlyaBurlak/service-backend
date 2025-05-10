import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

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
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
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
