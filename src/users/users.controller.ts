import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto/user.dto';
import { SuccessResponseDto } from '../common/dto/success-response.dto';

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Получить список всех пользователей' })
  @ApiResponse({
    status: 200,
    description: 'Список пользователей',
    type: [UserResponseDto],
  })
  async findAll(): Promise<UserResponseDto[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить пользователя по ID' })
  @ApiParam({ name: 'id', description: 'ID пользователя', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Информация о пользователе',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserResponseDto> {
    return this.usersService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Создать нового пользователя',
    description:
      'Административная функция. Для обычной регистрации используйте /auth/register',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно создан',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Неверные данные' })
  async create(@Body() data: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(data as Prisma.UserCreateInput);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Обновить информацию о пользователе',
    description: 'Можно обновить только свой профиль (или админ может обновить любой)',
  })
  @ApiParam({ name: 'id', description: 'ID пользователя', type: Number })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'Пользователь успешно обновлен',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number; role?: string },
    @Body() data: UpdateUserDto,
  ): Promise<UserResponseDto> {
    // Do not allow password updates here to avoid unhashed saves
    if ('password' in (data as Record<string, unknown>)) {
      const { password, ...rest } = data as Record<string, unknown>;
      return this.usersService.update(
        id,
        user.id,
        user.role,
        rest as unknown as Prisma.UserUpdateInput,
      );
    }
    return this.usersService.update(id, user.id, user.role, data as Prisma.UserUpdateInput);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Удалить пользователя',
    description: 'Можно удалить только свой аккаунт (или админ может удалить любой)',
  })
  @ApiParam({ name: 'id', description: 'ID пользователя', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Пользователь успешно удален',
    type: SuccessResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number; role?: string },
  ): Promise<SuccessResponseDto> {
    return this.usersService.remove(id, user.id, user.role);
  }
}
