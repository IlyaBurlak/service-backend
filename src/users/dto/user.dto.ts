import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email пользователя',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Пароль пользователя', example: 'password123' })
  @IsString()
  password: string;

  @ApiProperty({ description: 'Имя пользователя', example: 'Иван' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Фамилия пользователя',
    example: 'Иванов',
    required: false,
  })
  @IsString()
  @IsOptional()
  surname?: string;

  @ApiProperty({
    description: 'Является ли гостем',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isGuest?: boolean;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: 'Email пользователя',
    example: 'user@example.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Петр',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Фамилия пользователя',
    example: 'Петров',
    required: false,
  })
  @IsString()
  @IsOptional()
  surname?: string;
}

export class UserResponseDto {
  @ApiProperty({ description: 'ID пользователя', example: 1 })
  id: number;

  @ApiProperty({
    description: 'Email пользователя',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({ description: 'Имя пользователя', example: 'Иван' })
  name: string;

  @ApiProperty({ description: 'Фамилия пользователя', example: 'Иванов' })
  surname: string;

  @ApiProperty({ description: 'Является ли гостем', example: false })
  isGuest: boolean;

  @ApiProperty({
    description: 'Дата создания',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;
}
