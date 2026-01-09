import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LessonsPublisher } from './lessons.publisher';
import type { Lesson, LessonCreatedEvent, LessonUpdatedEvent } from './types';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { User } from '../common/decorators/user.decorator';
import { JWTAuthGuard } from '../auth/jwt-auth.guard';
import { LessonsService } from './lessons.service';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';

@UseGuards(JWTAuthGuard, RolesGuard)
@Controller('lessons')
export class LessonsController {
  constructor(
    private readonly lessonsPublisher: LessonsPublisher,
    private readonly lessonsService: LessonsService,
  ) {}

  @Post()
  @Roles('TEACHER')
  createLesson(@User('id') teacherId: string, @Body() dto: CreateLessonDto) {
    const eventPayload: LessonCreatedEvent = {
      title: dto.title,
      description: dto.description,
      date: dto.date,
      time: dto.time,
      countOfStudents: dto.countOfStudents,
      teacherId,
      status:
        dto.countOfStudents > 0 ? 'available' : (dto.status ?? 'available'),
    };

    this.lessonsPublisher.publishLessonCreated(eventPayload);

    return {
      status: 'Lesson event sent',
      lesson: eventPayload,
    };
  }

  // Get Lessons for TEACHER
  @Get('my-lessons')
  async getMyLessons(@User('id') teacherId: string): Promise<Lesson[]> {
    const lessons = await this.lessonsService.getTeacherLessons(teacherId);
    return lessons;
  }

  // Get Lessons for USER/STUDENT
  @Get('students-lessons')
  async getMyStudentsLessons(@User('id') studentId: string): Promise<Lesson[]> {
    const lessons = await this.lessonsService.getStudentsLessons(studentId);
    return lessons;
  }

  @Patch(':id')
  @Roles('TEACHER')
  updateLesson(
    @Param('id') lessonId: string,
    @User('id') teacherId: string,
    @Body() dto: UpdateLessonDto,
  ) {
    const eventPayload: LessonUpdatedEvent = {
      id: lessonId,
      teacherId,
      ...dto,
    };

    this.lessonsPublisher.publishLessonUpdated(eventPayload);

    return {
      status: 'Lesson update event sent',
      lesson: eventPayload,
    };
  }

  @Delete(':id')
  @Roles('TEACHER')
  deleteLesson(@Param('id') lessonId: string, @User('id') teacherId: string) {
    const eventPayload = { id: lessonId, teacherId };
    this.lessonsPublisher.publishLessonDeleted(eventPayload);

    return {
      status: 'Lesson delete event sent',
      lesson: eventPayload,
    };
  }

  @Post(':id/join')
  async joinLesson(@Param('id') lessonId: string, @User('id') userId: string) {
    try {
      const lessonStudent = await this.lessonsPublisher.publishStudentJoined({
        lessonId,
        userId,
      });

      return {
        status: 'Student successfully joined lesson',
        lessonStudent,
      };
    } catch (err: unknown) {
      return {
        status: 'Failed to join lesson',
        message: err instanceof Error ? err.message : 'Unknown error',
      };
    }
  }
}
