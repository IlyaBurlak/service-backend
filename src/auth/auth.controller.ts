import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import {
  LoginResponseDto,
  RegisterResponseDto,
  GuestRegisterResponseDto,
  MeResponseDto,
} from './dto/auth-response.dto';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Вход пользователя' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Успешный вход',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Неверные учетные данные' })
  async login(@Body() body: LoginDto): Promise<LoginResponseDto> {
    const user = await this.authService.validateUser(body.email, body.password);
    return this.authService.login(user);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'Успешная регистрация',
    type: RegisterResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Неверные данные' })
  async register(@Body() body: RegisterDto): Promise<RegisterResponseDto> {
    return this.authService.register({
      email: body.email,
      password: body.password,
      name: body.name,
      surname: body.surname,
    });
  }

  @Post('register/guest')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Регистрация гостевого пользователя' })
  @ApiResponse({
    status: 201,
    description: 'Успешная регистрация гостя',
    type: GuestRegisterResponseDto,
  })
  async registerGuest(): Promise<GuestRegisterResponseDto> {
    return this.authService.registerGuest();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Получить информацию о текущем пользователе' })
  @ApiResponse({
    status: 200,
    description: 'Информация о пользователе',
    type: MeResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async getMe(@CurrentUser() user: { id: number }): Promise<MeResponseDto> {
    const userData = await this.authService.getMe(user.id);
    if (!userData) {
      throw new NotFoundException('User not found');
    }
    return userData;
  }
}
