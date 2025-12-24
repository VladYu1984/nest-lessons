import {
  IsOptional,
  IsString,
  IsDateString,
  IsEnum,
  IsInt,
  Min,
} from 'class-validator';

export class UpdateLessonDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  time?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  countOfStudents?: number;

  @IsOptional()
  @IsEnum(['available', 'no_places', 'over'])
  status?: 'available' | 'no_places' | 'over';
}
