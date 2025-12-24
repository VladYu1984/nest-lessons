import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { TableStatus, Lesson } from '@prisma/lessons-service-client';
import { LessonCreatedEvent, LessonUpdatedEvent } from './types';

@Injectable()
export class LessonsService {
  constructor(private readonly prisma: PrismaService) {}

  async createLesson(payload: LessonCreatedEvent): Promise<Lesson> {
    return await this.prisma.lesson.create({
      data: {
        title: payload.title,
        description: payload.description,
        date: new Date(payload.date),
        time: payload.time,
        teacherId: payload.teacherId,
        countOfStudents: payload.countOfStudents,
        students: [],
        status: payload.status ?? TableStatus.available,
      },
    });
  }

  async updateLesson(payload: LessonUpdatedEvent): Promise<Lesson | null> {
    const { id, teacherId, title, description, time } = payload;

    const updated = await this.prisma.lesson.updateMany({
      where: { id, teacherId },
      data: {
        title,
        description,
        time,
        countOfStudents: payload.countOfStudents,
        status: payload.status,
        date: payload.date ? new Date(payload.date) : undefined,
      },
    });

    if (updated.count === 0) {
      return null;
    }

    return this.prisma.lesson.findUnique({ where: { id } });
  }

  async getLessonsByTeacher(teacherId: string) {
    return this.prisma.lesson.findMany({
      where: { teacherId },
      orderBy: { date: 'asc' },
    });
  }

  async deleteLesson(payload: {
    id: string;
    teacherId: string;
  }): Promise<boolean> {
    const deleted = await this.prisma.lesson.deleteMany({
      where: { id: payload.id, teacherId: payload.teacherId },
    });

    return deleted.count > 0;
  }

  async addStudentToLesson(
    lessonId: string,
    userId: string,
  ): Promise<Lesson | null> {
    const lesson: Lesson | null = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      return null;
    }

    if (lesson.teacherId === userId) {
      throw new ForbiddenException('Teacher cannot join their own lesson');
    }

    if (lesson.students.includes(userId)) {
      return lesson;
    }

    if (
      lesson.countOfStudents > 0 &&
      lesson.students.length >= lesson.countOfStudents
    ) {
      throw new Error('Lesson is full');
    }

    if (
      lesson.countOfStudents > 0 &&
      lesson.students.length >= lesson.countOfStudents
    ) {
      return this.prisma.lesson.update({
        where: { id: lessonId },
        data: {
          status: TableStatus.no_places,
        },
      });
    }

    const willBeFull =
      lesson.countOfStudents > 0 &&
      lesson.students.length + 1 >= lesson.countOfStudents;

    return this.prisma.lesson.update({
      where: { id: lessonId },
      data: {
        students: { push: userId },
        status: willBeFull ? TableStatus.no_places : lesson.status,
      },
    });
  }
}
