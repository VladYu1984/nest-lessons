import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  LessonCreatedEvent,
  LessonStudentJoinedEvent,
  LessonUpdatedEvent,
  LessonWithStudents,
} from './types';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class LessonsPublisher {
  constructor(@Inject('LESSONS_RMQ') private readonly client: ClientProxy) {}

  publishLessonCreated(payload: LessonCreatedEvent) {
    return this.client.emit('lesson_created', payload);
  }

  publishLessonUpdated(payload: LessonUpdatedEvent) {
    return this.client.emit('lesson_updated', payload);
  }

  publishLessonDeleted(payload: { id: string; teacherId: string }) {
    return this.client.emit('lesson_deleted', payload);
  }

  publishStudentJoined(
    payload: LessonStudentJoinedEvent,
  ): Promise<LessonWithStudents> {
    return firstValueFrom(
      this.client.send<LessonWithStudents, LessonStudentJoinedEvent>(
        'lesson_student_joined',
        payload,
      ),
    );
  }
}
