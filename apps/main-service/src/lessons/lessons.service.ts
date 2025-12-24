import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import type { Lesson, LessonsGrpcService } from './types';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class LessonsService implements OnModuleInit {
  private grpcService: LessonsGrpcService;

  constructor(@Inject('LESSONS_GRPC') private client: ClientGrpc) {}

  onModuleInit() {
    this.grpcService =
      this.client.getService<LessonsGrpcService>('LessonsService');
  }

  async getTeacherLessons(teacherId: string): Promise<Lesson[]> {
    const response = await firstValueFrom(
      this.grpcService.getTeacherLessons({ teacherId }),
    );

    return response.lessons;
  }
}
