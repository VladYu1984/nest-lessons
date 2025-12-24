import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '../database/prisma.module';
import { ProfileModule } from '../profile/profile.module';

@Module({
  imports: [PrismaModule, ProfileModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
