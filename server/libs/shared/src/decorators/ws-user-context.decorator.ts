import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Socket } from 'socket.io';

export const WsUserContext = createParamDecorator(
  (data: keyof any, context: ExecutionContext) => {
    const client = context.switchToWs().getClient<Socket>();
    const user = (client as any).user;
    return data ? user?.[data] : user;
  },
);
