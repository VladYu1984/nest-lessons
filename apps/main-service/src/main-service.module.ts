import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MainServiceController } from './main-service.controller';
import { MainServiceService } from './main-service.service';
import { PrismaModule } from './database/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { LessonsModule } from './lessons/lessons.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/main-service/.env',
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    ProfileModule,
    LessonsModule,
  ],
  controllers: [MainServiceController],
  providers: [MainServiceService],
})
export class MainServiceModule {}
