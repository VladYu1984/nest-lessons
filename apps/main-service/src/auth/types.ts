import type { Request } from 'express';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

export interface RequestUser {
  id: string;
  email: string;
  role: string;
}

export interface RequestWithUser extends Request {
  user: RequestUser;
}
