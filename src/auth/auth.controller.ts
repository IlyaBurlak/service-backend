import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';

interface LoginResponse {
  access_token: string;
}

interface RegisterResponse extends Omit<User, 'password'> {
  createdAt: Date;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
  ): Promise<LoginResponse> {
    const user = await this.authService.validateUser(body.email, body.password);
    return this.authService.login(user);
  }

  @Post('register')
  async register(
    @Body()
    body: {
      email: string;
      password: string;
      name: string;
      surname: string;
    },
  ): Promise<RegisterResponse> {
    return this.authService.register({
      email: body.email,
      password: body.password,
      name: body.name,
      surname: body.surname,
      isGuest: false,
    });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() user: { id: number }) {
    const userData = await this.authService.getMe(user.id);
    if (!userData) {
      throw new NotFoundException('User not found');
    }
    return userData;
  }
}
