import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));

  const corsOrigins = process.env.CORS_ORIGINS || 'http://localhost:5173';

  app.enableCors({
    origin: corsOrigins.split(','),
    methods: 'GET, POST, PUT, PATCH, DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
