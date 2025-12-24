import { IsString, IsDateString, IsOptional, IsEnum } from 'class-validator';
import { TableStatus } from '@prisma/lessons-service-client';

export class CreateLessonDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDateString()
  date: string;

  @IsString()
  time: string;

  @IsOptional()
  @IsEnum(TableStatus)
  status: TableStatus;
}
