import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// глобальный доступ к модулю во всем микросервисе
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
