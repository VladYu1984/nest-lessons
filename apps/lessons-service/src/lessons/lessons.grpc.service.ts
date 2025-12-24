import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { PrismaService } from '../database/prisma.service';

@Controller()
export class LessonsGrpcService {
  constructor(private readonly prisma: PrismaService) {}

  @GrpcMethod('LessonsService', 'GetTeacherLessons')
  async getTeacherLessons({ teacherId }: { teacherId: string }): Promise<{
    lessons: {
      id: string;
      title: string;
      description: string;
      date: string;
      time: string;
      status: string;
    }[];
  }> {
    const lessons = await this.prisma.lesson.findMany({
      where: { teacherId },
    });

    return {
      lessons: lessons.map((l) => ({
        id: l.id,
        title: l.title,
        description: l.description,
        date: l.date.toISOString().split('T')[0],
        time: l.time,
        status: l.status,
      })),
    };
  }
}
