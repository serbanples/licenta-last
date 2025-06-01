import { Inject, Injectable } from "@nestjs/common";
import { NOTIFICATION_SERVER_NAME } from "./clients.constants";
import { ClientProxy } from "@nestjs/microservices";
import { notificationMessage } from "./messages.constants";
import { NotificationTopicEnum } from "@app/types";

@Injectable()
export class NotificationProxyService {
    constructor(@Inject(NOTIFICATION_SERVER_NAME) private readonly proxy: ClientProxy) { }

    sendUploaderEvent(sendTo: string, data: any) {
        this.proxy.emit(notificationMessage, { sendTo, topic: NotificationTopicEnum.UPLOAD , data })
    }
} 