import { Role } from '@prisma/client';

export interface CreateUserParams {
  email: string;
  name: string;
  password: string;
  role: Role;
}
