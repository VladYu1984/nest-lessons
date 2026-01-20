import { Role } from '@prisma/main-service-client';

export interface CreateUserParams {
  email: string;
  name: string;
  password: string;
  role: Role;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  profile: {
    id: string;
    about: string | null;
    avatarUrl: string | null;
    userId: string;
  } | null;
}
