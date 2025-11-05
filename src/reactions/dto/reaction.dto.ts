import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsInt } from 'class-validator';

export class CreateReactionDto {
  @ApiProperty({
    description: 'Тип реакции',
    example: 'like',
    enum: ['like', 'dislike', 'heart', 'laugh', 'angry'],
  })
  @IsString()
  type: string;

  @ApiProperty({
    description: 'ID комментария, к которому относится реакция',
    example: 1,
    required: false,
    nullable: true,
  })
  @IsInt()
  @IsOptional()
  commentId?: number | null;
}

export class UpdateReactionDto extends PartialType(CreateReactionDto) {
  @ApiProperty({
    description: 'Тип реакции',
    example: 'dislike',
    required: false,
  })
  @IsString()
  @IsOptional()
  type?: string;
}

export class ReactionResponseDto {
  @ApiProperty({ description: 'ID реакции', example: 1 })
  id: number;

  @ApiProperty({ description: 'Тип реакции', example: 'like' })
  type: string;

  @ApiProperty({ description: 'ID пользователя', example: 1 })
  userId: number;

  @ApiProperty({ description: 'ID комментария', example: 1, nullable: true })
  commentId: number | null;
}

export class QueryReactionsDto {
  @ApiProperty({
    description: 'Фильтр по ID комментария',
    example: 1,
    required: false,
    type: Number,
  })
  @IsInt()
  @IsOptional()
  commentId?: number;
}
