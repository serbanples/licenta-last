import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserContextType } from '../types';

export const UserContext = createParamDecorator(
  (data: keyof UserContextType | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as UserContextType;

    // If data is specified, return the property of user
    // Otherwise return the whole user object
    return data ? user?.[data] : user;
  },
);