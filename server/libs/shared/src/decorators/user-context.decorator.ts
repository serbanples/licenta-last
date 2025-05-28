import { RequestWrapper, UserContextType } from '@app/types';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserContext = createParamDecorator(
  (data: keyof UserContextType | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWrapper>();
    const user = request.user;

    // If data is specified, return the property of user
    // Otherwise return the whole user object
    return data ? user?.[data] : user;
  },
);