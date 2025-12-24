import { Role } from '@prisma/main-service-client';

export interface CreateUserParams {
  email: string;
  name: string;
  password: string;
  role: Role;
}
