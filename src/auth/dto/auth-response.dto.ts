import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    description: 'JWT токен доступа',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;
}

export class RegisterResponseDto {
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

export class GuestRegisterResponseDto extends LoginResponseDto {
  @ApiProperty({ description: 'Имя гостя', example: 'Гость' })
  name: string;

  @ApiProperty({ description: 'Фамилия гостя', example: '' })
  surname: string;
}

export class MeResponseDto {
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

