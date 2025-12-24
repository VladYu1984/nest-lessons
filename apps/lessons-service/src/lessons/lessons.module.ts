import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { PrismaService } from '../database/prisma.service';
import { LessonsController } from './lessons.controller';
import { LessonsGrpcService } from './lessons.grpc.service';

@Module({
  controllers: [LessonsController, LessonsGrpcService],
  providers: [LessonsService, PrismaService],
})
export class LessonsModule {}
