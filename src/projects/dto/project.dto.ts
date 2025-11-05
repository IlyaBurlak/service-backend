import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ description: 'Название проекта', example: 'Мой проект' })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'URL изображения',
    example: 'https://example.com/image.jpg',
    required: false,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  image?: string | null;

  @ApiProperty({
    description: 'URL большого изображения',
    example: 'https://example.com/image-big.jpg',
    required: false,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  imageBig?: string | null;

  @ApiProperty({
    description: 'Ссылка на GitHub репозиторий',
    example: 'https://github.com/user/repo',
    required: false,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  github?: string | null;

  @ApiProperty({
    description: 'Ссылка на деплой',
    example: 'https://deploy.example.com',
    required: false,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  linkOnDeploy?: string | null;

  @ApiProperty({
    description: 'Дополнительная ссылка',
    example: 'https://example.com',
    required: false,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  link?: string | null;

  @ApiProperty({ description: 'Категория/фильтр проекта', example: 'web' })
  @IsString()
  filter: string;

  @ApiProperty({
    description: 'Массив тегов',
    example: ['React', 'TypeScript', 'Node.js'],
    type: [String],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}

export class TagDto {
  @ApiProperty({ description: 'ID тега', example: 1 })
  id: number;

  @ApiProperty({ description: 'Название тега', example: 'React' })
  name: string;
}

export class ProjectResponseDto {
  @ApiProperty({ description: 'ID проекта', example: 1 })
  id: number;

  @ApiProperty({ description: 'Название проекта', example: 'Мой проект' })
  title: string;

  @ApiProperty({
    description: 'URL изображения',
    example: 'https://example.com/image.jpg',
    nullable: true,
  })
  image: string | null;

  @ApiProperty({
    description: 'URL большого изображения',
    example: 'https://example.com/image-big.jpg',
    nullable: true,
  })
  imageBig: string | null;

  @ApiProperty({
    description: 'Ссылка на GitHub репозиторий',
    example: 'https://github.com/user/repo',
    nullable: true,
  })
  github: string | null;

  @ApiProperty({
    description: 'Ссылка на деплой',
    example: 'https://deploy.example.com',
    nullable: true,
  })
  linkOnDeploy: string | null;

  @ApiProperty({
    description: 'Дополнительная ссылка',
    example: 'https://example.com',
    nullable: true,
  })
  link: string | null;

  @ApiProperty({ description: 'Категория/фильтр проекта', example: 'web' })
  filter: string;

  @ApiProperty({ description: 'Теги проекта', type: [TagDto] })
  tags: TagDto[];
}

