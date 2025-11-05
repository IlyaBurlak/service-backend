import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Текст комментария',
    example: 'Отличный проект!',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  comment: string;
}

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  @ApiProperty({
    description: 'Текст комментария',
    example: 'Обновленный текст комментария',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(1)
  comment?: string;
}

export class UserInCommentDto {
  @ApiProperty({ description: 'ID пользователя', example: 1 })
  id: number;

  @ApiProperty({ description: 'Email пользователя', example: 'user@example.com' })
  email: string;

  @ApiProperty({ description: 'Имя пользователя', example: 'Иван' })
  name: string;

  @ApiProperty({ description: 'Фамилия пользователя', example: 'Иванов' })
  surname: string;

  @ApiProperty({ description: 'Является ли гостем', example: false })
  isGuest: boolean;

  @ApiProperty({ description: 'Дата создания', example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;
}

export class ReactionInCommentDto {
  @ApiProperty({ description: 'ID реакции', example: 1 })
  id: number;

  @ApiProperty({ description: 'Тип реакции', example: 'like' })
  type: string;

  @ApiProperty({ description: 'ID пользователя', example: 1 })
  userId: number;

  @ApiProperty({ description: 'ID комментария', example: 1, nullable: true })
  commentId: number | null;
}

export class CommentResponseDto {
  @ApiProperty({ description: 'ID комментария', example: 1 })
  id: number;

  @ApiProperty({ description: 'Текст комментария', example: 'Отличный проект!' })
  comment: string;

  @ApiProperty({ description: 'Дата создания', example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'ID пользователя', example: 1 })
  userId: number;

  @ApiProperty({ description: 'Информация о пользователе', type: UserInCommentDto })
  user: UserInCommentDto;

  @ApiProperty({ description: 'Реакции на комментарий', type: [ReactionInCommentDto] })
  Reaction: ReactionInCommentDto[];
}

