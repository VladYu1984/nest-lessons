import { Module } from '@nestjs/common';
import { LessonsController } from './lessons.controller';
import { LessonsPublisher } from './lessons.publisher';
import { LessonsService } from './lessons.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    // RabbitMQ
    ClientsModule.register([
      {
        name: 'LESSONS_RMQ',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672'],
          queue: 'lessons_queue',
          queueOptions: { durable: true },
        },
      },
    ]),

    // gRPC
    ClientsModule.register([
      {
        name: 'LESSONS_GRPC',
        transport: Transport.GRPC,
        options: {
          package: 'lessons',
          protoPath: join(
            process.cwd(),
            'apps/main-service/src/proto/lessons.proto',
          ),
          url: 'localhost:50051',
        },
      },
    ]),

    // modules
    UserModule,
  ],
  controllers: [LessonsController],
  providers: [LessonsService, LessonsPublisher],
})
export class LessonsModule {}
