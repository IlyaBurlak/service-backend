import { Module } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { ReactionsController } from './reactions.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ReactionsController],
  providers: [ReactionsService],
})
export class ReactionsModule {}
