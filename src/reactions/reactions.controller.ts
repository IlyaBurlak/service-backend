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
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { ReactionsService } from './reactions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import {
  CreateReactionDto,
  UpdateReactionDto,
  ReactionResponseDto,
  QueryReactionsDto,
} from './dto/reaction.dto';
import { SuccessResponseDto } from '../common/dto/success-response.dto';

@ApiTags('Реакции')
@Controller('reactions')
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Get()
  @ApiOperation({ summary: 'Получить список всех реакций' })
  @ApiQuery({
    name: 'commentId',
    description: 'Фильтр по ID комментария',
    required: false,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Список реакций',
    type: [ReactionResponseDto],
  })
  async findAll(
    @Query() query: QueryReactionsDto,
  ): Promise<ReactionResponseDto[]> {
    return this.reactionsService.findAll({
      commentId: query.commentId,
    });
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Создать новую реакцию' })
  @ApiBody({ type: CreateReactionDto })
  @ApiResponse({
    status: 201,
    description: 'Реакция успешно создана',
    type: ReactionResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 400, description: 'Неверные данные' })
  async create(
    @CurrentUser() user: { id: number },
    @Body() body: CreateReactionDto,
  ): Promise<ReactionResponseDto> {
    return this.reactionsService.create(user.id, body);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Обновить реакцию',
    description: 'Можно обновить только свою реакцию (или админ может обновить любую)',
  })
  @ApiParam({ name: 'id', description: 'ID реакции', type: Number })
  @ApiBody({ type: UpdateReactionDto })
  @ApiResponse({
    status: 200,
    description: 'Реакция успешно обновлена',
    type: ReactionResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  @ApiResponse({ status: 404, description: 'Реакция не найдена' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number; role?: string },
    @Body() body: UpdateReactionDto,
  ): Promise<ReactionResponseDto> {
    return this.reactionsService.update(id, user.id, user.role, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Удалить реакцию',
    description: 'Можно удалить только свою реакцию (или админ может удалить любую)',
  })
  @ApiParam({ name: 'id', description: 'ID реакции', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Реакция успешно удалена',
    type: SuccessResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  @ApiResponse({ status: 404, description: 'Реакция не найдена' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number; role?: string },
  ): Promise<SuccessResponseDto> {
    return this.reactionsService.remove(id, user.id, user.role);
  }
}
