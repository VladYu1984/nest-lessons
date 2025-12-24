export type LessonStatus = 'available' | 'no_places' | 'over';

export interface LessonBaseEvent {
  title: string;
  description: string;
  date: string;
  time: string;
  countOfStudents: number;
  status?: LessonStatus;
}

export interface LessonCreatedEvent extends LessonBaseEvent {
  teacherId: string;
}

export interface LessonUpdatedEvent extends Partial<LessonBaseEvent> {
  id: string;
  teacherId: string;
}

export interface LessonDeletedEvent {
  id: string;
  teacherId: string;
}

export interface LessonStudentJoinedEvent {
  lessonId: string;
  userId: string;
}
