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
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  CreateProjectDto,
  UpdateProjectDto,
  ProjectResponseDto,
} from './dto/project.dto';
import { SuccessResponseDto } from '../common/dto/success-response.dto';

@ApiTags('Проекты')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'Получить список всех проектов' })
  @ApiResponse({
    status: 200,
    description: 'Список проектов',
    type: [ProjectResponseDto],
  })
  async findAll(): Promise<ProjectResponseDto[]> {
    return this.projectsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить проект по ID' })
  @ApiParam({ name: 'id', description: 'ID проекта', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Информация о проекте',
    type: ProjectResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Проект не найден' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Создать новый проект' })
  @ApiBody({ type: CreateProjectDto })
  @ApiResponse({
    status: 201,
    description: 'Проект успешно создан',
    type: ProjectResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 400, description: 'Неверные данные' })
  async create(@Body() body: CreateProjectDto): Promise<ProjectResponseDto> {
    return this.projectsService.create(body);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Обновить проект' })
  @ApiParam({ name: 'id', description: 'ID проекта', type: Number })
  @ApiBody({ type: UpdateProjectDto })
  @ApiResponse({
    status: 200,
    description: 'Проект успешно обновлен',
    type: ProjectResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 404, description: 'Проект не найден' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProjectDto,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Удалить проект' })
  @ApiParam({ name: 'id', description: 'ID проекта', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Проект успешно удален',
    type: SuccessResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 404, description: 'Проект не найден' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessResponseDto> {
    return this.projectsService.remove(id);
  }
}
