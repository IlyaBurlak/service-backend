import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/api/test')
  getTestData() {
    return {
      message: 'CORS работает!',
      timestamp: new Date().toISOString(),
    };
  }

  @Get()
  getHello(): string {
    return 'Hello World!';
  }
}
