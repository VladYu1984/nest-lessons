import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MainServiceController } from './main-service.controller';
import { MainServiceService } from './main-service.service';
import { PrismaModule } from './database/prisma.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/main-service/.env',
    }),
    PrismaModule,
    UserModule,
  ],
  controllers: [MainServiceController],
  providers: [MainServiceService],
})
export class MainServiceModule {}
