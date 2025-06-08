import { CoreProxyService } from "@app/clients/coreProxy.service";
import { UserContext } from "@app/shared";
import { UserContextType } from "@app/types";
import { Controller, Get } from "@nestjs/common";

@Controller('notifications')
export class WebserverNotifController {

    constructor(private readonly coreProxy: CoreProxyService) {}

    @Get('browse')
    browse(@UserContext() user: UserContextType) {
        return this.coreProxy.getNotifications({ userContext: user, data: undefined });
    }

    @Get('updateSeen')  
    updateSeen(@UserContext() user: UserContextType) {
        return this.coreProxy.updateSeenNotifications({ userContext: user, data: undefined });
    }
}