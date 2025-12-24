import { NestFactory } from '@nestjs/core';
import { LessonsServiceModule } from './lessons-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    LessonsServiceModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://guest:guest@localhost:5672'],
        queue: 'lessons_queue',
        queueOptions: { durable: true },
      },
    },
  );

  const grpcApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    LessonsServiceModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'lessons',
        protoPath: join(
          process.cwd(),
          'apps/lessons-service/src/proto/lessons.proto',
        ),
        url: '0.0.0.0:50051',
      },
    },
  );

  await Promise.all([app.listen(), grpcApp.listen()]);
  console.log('Lessons-service RMQ + gRPC running...');
}
bootstrap();
