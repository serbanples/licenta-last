import { notificationBrowse, notificationUpdateSeen } from "@app/clients";
import { Authorize, PayloadUserContext, RpcErrorEncoder } from "@app/shared";
import { UserContextType } from "@app/types";
import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { NotificationService } from "../modules/notification.service";

@Controller()
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @MessagePattern(notificationBrowse)
    @Authorize('browse', 'notification')
    @RpcErrorEncoder()
    browse(@PayloadUserContext() user: UserContextType) {
        return this.notificationService.browse(user);
    }

    @MessagePattern(notificationUpdateSeen)
    @Authorize('updateSeen', 'notification')
    @RpcErrorEncoder()
    updateSeen(@PayloadUserContext() user: UserContextType) {
        return this.notificationService.updateSeen(user);
    }

}