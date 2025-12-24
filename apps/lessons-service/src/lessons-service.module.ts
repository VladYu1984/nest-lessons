import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LessonsServiceController } from './lessons-service.controller';
import { LessonsServiceService } from './lessons-service.service';
import { PrismaModule } from './database/prisma.module';
import { LessonsModule } from './lessons/lessons.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/lessons-service/.env',
    }),
    PrismaModule,
    LessonsModule,
  ],
  controllers: [LessonsServiceController],
  providers: [LessonsServiceService],
})
export class LessonsServiceModule {}
