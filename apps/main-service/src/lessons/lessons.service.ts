import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import type { Lesson, LessonsGrpcService } from './types';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../user/user.service';
import { UserProfile } from '../user/types';

@Injectable()
export class LessonsService implements OnModuleInit {
  private grpcService: LessonsGrpcService;

  constructor(
    @Inject('LESSONS_GRPC')
    private client: ClientGrpc,
    private readonly userService: UserService,
  ) {}

  onModuleInit() {
    this.grpcService =
      this.client.getService<LessonsGrpcService>('LessonsService');
  }

  async getLessonsByRole(userId: string, role: string): Promise<Lesson[]> {
    const strategy = this.getStrategyByRole(role);
    return strategy(userId);
  }

  private getStrategyByRole(
    role: string,
  ): (userId: string) => Promise<Lesson[]> {
    switch (role) {
      case 'TEACHER':
        return (userId: string) => this.getTeacherLessons(userId);
      case 'STUDENT':
        return (userId: string) => this.getStudentsLessons(userId);
      default:
        return () => Promise.resolve([]);
    }
  }

  private async getTeacherLessons(
    teacherId: string,
  ): Promise<
    (Omit<Lesson, 'students'> & { studentProfiles: UserProfile[] })[]
  > {
    const response = await firstValueFrom(
      this.grpcService.getTeacherLessons({ teacherId }),
    );

    return this.addStudentProfiles(response.lessons);
  }

  private async getStudentsLessons(studentId: string): Promise<Lesson[]> {
    const response = await firstValueFrom(
      this.grpcService.getStudentsLessons({ studentId }),
    );

    return response.lessons;
  }

  private async addStudentProfiles(
    lessons: Lesson[],
  ): Promise<
    (Omit<Lesson, 'students'> & { studentProfiles: UserProfile[] })[]
  > {
    // 1️⃣ Собираем все уникальные id студентов
    const allStudentIds = lessons.flatMap((l) => l.students ?? []);
    const uniqueIds = Array.from(
      new Set(allStudentIds.filter((id): id is string => !!id)),
    );

    // 2️⃣ Получаем профили студентов
    const students: UserProfile[] = uniqueIds.length
      ? await this.userService.getUsersByIds(uniqueIds)
      : [];

    const studentsMap = new Map(students.map((u) => [u.id, u]));

    // 3️⃣ Возвращаем уроки с studentProfiles
    return lessons.map((l) => ({
      id: l.id,
      title: l.title,
      description: l.description,
      date: l.date,
      time: l.time,
      status: l.status,
      countOfStudents: l.countOfStudents,
      teacherId: l.teacherId,
      studentProfiles: (l.students ?? [])
        .map((id) => studentsMap.get(id))
        .filter((u): u is UserProfile => !!u), // убираем undefined
    }));
  }
}
