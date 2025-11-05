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
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import {
  CreateCommentDto,
  UpdateCommentDto,
  CommentResponseDto,
} from './dto/comment.dto';
import { SuccessResponseDto } from '../common/dto/success-response.dto';

@ApiTags('Комментарии')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  @ApiOperation({ summary: 'Получить список всех комментариев' })
  @ApiResponse({
    status: 200,
    description: 'Список комментариев',
    type: [CommentResponseDto],
  })
  async findAll(): Promise<CommentResponseDto[]> {
    return this.commentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить комментарий по ID' })
  @ApiParam({ name: 'id', description: 'ID комментария', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Информация о комментарии',
    type: CommentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Комментарий не найден' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<CommentResponseDto> {
    return this.commentsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Создать новый комментарий' })
  @ApiBody({ type: CreateCommentDto })
  @ApiResponse({
    status: 201,
    description: 'Комментарий успешно создан',
    type: CommentResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 400, description: 'Неверные данные' })
  async create(
    @CurrentUser() user: { id: number },
    @Body() body: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    return this.commentsService.create(user.id, body);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Обновить комментарий',
    description: 'Можно обновить только свой комментарий',
  })
  @ApiParam({ name: 'id', description: 'ID комментария', type: Number })
  @ApiBody({ type: UpdateCommentDto })
  @ApiResponse({
    status: 200,
    description: 'Комментарий успешно обновлен',
    type: CommentResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  @ApiResponse({ status: 404, description: 'Комментарий не найден' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
    @Body() body: UpdateCommentDto,
  ): Promise<CommentResponseDto> {
    return this.commentsService.update(id, user.id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Удалить комментарий',
    description: 'Можно удалить только свой комментарий',
  })
  @ApiParam({ name: 'id', description: 'ID комментария', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Комментарий успешно удален',
    type: SuccessResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  @ApiResponse({ status: 404, description: 'Комментарий не найден' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ): Promise<SuccessResponseDto> {
    return this.commentsService.remove(id, user.id);
  }
}


