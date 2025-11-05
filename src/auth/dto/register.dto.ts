import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Email пользователя',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Иван',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Фамилия пользователя',
    example: 'Иванов',
    required: false,
  })
  @IsString()
  surname: string;
}
