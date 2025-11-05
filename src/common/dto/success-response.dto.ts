import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDto {
  @ApiProperty({ description: 'Успешное выполнение операции', example: true })
  success: boolean;
}
