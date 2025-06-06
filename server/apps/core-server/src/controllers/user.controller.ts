import { Authorize, LoggerInterceptor, PayloadData, PayloadUserContext, RpcErrorEncoder } from "@app/shared";
import { UserContextType } from "@app/types";
import { Controller, UseInterceptors } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";

@UseInterceptors(LoggerInterceptor)
@Controller()
export class UserController {
    constructor() {}

    @MessagePattern('')
    @Authorize('browse', 'users')
    @RpcErrorEncoder()
    browse(@PayloadUserContext() userContext: UserContextType, @PayloadData() data: UserBrowseFilter) {
        console.log(data)
    }

}