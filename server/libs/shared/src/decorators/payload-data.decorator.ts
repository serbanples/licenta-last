import { WithContext } from "@app/types";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const PayloadData = createParamDecorator(
  (_data: any, ctx: ExecutionContext) => {
    const rpcContext = ctx.switchToRpc();
    const payload = rpcContext.getData() as WithContext<any>;

    return payload?.data;
  },
);