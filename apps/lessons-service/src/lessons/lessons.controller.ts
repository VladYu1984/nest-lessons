import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { LessonsService } from './lessons.service';
import type {
  LessonCreatedEvent,
  LessonDeletedEvent,
  LessonStudentJoinedEvent,
  LessonUpdatedEvent,
} from './types';
import { Lesson } from '@prisma/lessons-service-client';

@Controller()
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @EventPattern('lesson_created')
  handleLessonCreated(@Payload() payload: LessonCreatedEvent) {
    return this.lessonsService.createLesson(payload);
  }

  @EventPattern('lesson_updated')
  handleLessonUpdated(@Payload() payload: LessonUpdatedEvent) {
    return this.lessonsService.updateLesson(payload);
  }

  @EventPattern('lesson_deleted')
  handleLessonDeleted(@Payload() payload: LessonDeletedEvent) {
    return this.lessonsService.deleteLesson(payload);
  }

  @EventPattern('lesson_student_joined')
  handleStudentJoined(
    @Payload() payload: LessonStudentJoinedEvent,
  ): Promise<Lesson | null> {
    return this.lessonsService.addStudentToLesson(
      payload.lessonId,
      payload.userId,
    );
  }
}
