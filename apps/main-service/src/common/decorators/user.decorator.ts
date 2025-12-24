import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestUser, RequestWithUser } from '../../auth/types';

export const User = createParamDecorator(
  (data: keyof RequestUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user) return null;

    return data ? user[data] : user;
  },
);
