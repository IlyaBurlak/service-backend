import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Тестовые эндпоинты')
@Controller()
export class AppController {
  @Get('/api/test')
  @ApiOperation({ summary: 'Тестовый эндпоинт для проверки CORS' })
  @ApiResponse({
    status: 200,
    description: 'Успешный ответ',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'CORS работает!' },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
      },
    },
  })
  getTestData() {
    return {
      message: 'CORS работает!',
      timestamp: new Date().toISOString(),
    };
  }

  @Get()
  @ApiOperation({ summary: 'Главная страница' })
  @ApiResponse({
    status: 200,
    description: 'Приветственное сообщение',
    type: String,
  })
  getHello(): string {
    return 'Hello World!';
  }
}
