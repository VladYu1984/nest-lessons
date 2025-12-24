import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';
import { UserService } from '../user/user.service';
import { JwtPayload } from './types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.access_token as string;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload.sub || typeof payload.sub !== 'string') {
      throw new UnauthorizedException('Invalid token payload');
    }

    const user = await this.userService.getUserById(payload.sub);
    if (!user) throw new UnauthorizedException('User not found');

    return { id: user.id, email: user.email, role: user.role };
  }
}
