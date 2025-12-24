import { IsString, IsDateString, IsInt, IsEnum } from 'class-validator';

export class CreateLessonDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDateString()
  date: string;

  @IsString()
  time: string;

  @IsInt()
  countOfStudents: number;

  @IsEnum(['available', 'no_places', 'over'])
  status?: 'available' | 'no_places' | 'over';
}
