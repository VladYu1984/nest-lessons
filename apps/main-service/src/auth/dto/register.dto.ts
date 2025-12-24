import { IsEmail, IsIn, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Email должен быть валидным' })
  email: string;

  @IsNotEmpty({ message: 'Пароль не должен быть пустым' })
  @MinLength(6, { message: 'Пароль должен быть минимум 6 символов' })
  password: string;

  @IsNotEmpty({ message: 'Имя не должно быть пустым' })
  name: string;

  @IsNotEmpty({ message: 'Роль не должна быть пустой' })
  @IsIn(['USER', 'TEACHER'], {
    message: 'Роль должна быть "user" или "teacher"',
  })
  role: 'USER' | 'TEACHER';
}
