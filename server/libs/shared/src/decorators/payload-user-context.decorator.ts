import { WithContext } from "@app/types";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const PayloadUserContext = createParamDecorator((data: any, ctx: ExecutionContext) => {
    const rpcContext = ctx.switchToRpc();
    const payload = rpcContext.getData() as WithContext<any>;

    return payload?.userContext;
})