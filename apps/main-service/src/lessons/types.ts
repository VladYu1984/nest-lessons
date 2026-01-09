import { Observable } from 'rxjs';

export type LessonStatus = 'available' | 'no_places' | 'over';

export interface LessonBase {
  title: string;
  description: string;
  date: string;
  time: string;
  countOfStudents: number;
  status: LessonStatus;
}

export interface LessonCreatedEvent extends LessonBase {
  teacherId: string;
}

export interface LessonUpdatedEvent extends Partial<LessonBase> {
  id: string;
  teacherId: string;
}

export interface Lesson extends LessonBase {
  id: string;
  teacherId: string;
}

export interface LessonsGrpcService {
  getTeacherLessons(data: {
    teacherId: string;
  }): Observable<{ lessons: Lesson[] }>;

  getStudentsLessons(data: {
    studentId: string;
  }): Observable<{ lessons: Lesson[] }>;
}

export interface LessonStudentJoinedEvent {
  lessonId: string;
  userId: string;
}

export interface LessonWithStudents extends Lesson {
  students: string[];
}
