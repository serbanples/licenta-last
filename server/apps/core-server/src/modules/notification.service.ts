import { NotificationModel } from "@app/dbacc";
import { UserContextType } from "@app/types";
import { Injectable } from "@nestjs/common";

@Injectable()
export class NotificationService {
    constructor(private readonly notificationsModel: NotificationModel) {}
    
    browse(user: UserContextType) {
        return this.notificationsModel.findWithPagination({}, { sendTo: user.id, isSeen: false });
    }

    updateSeen(user: UserContextType) {
        return this.notificationsModel.updateMany({ sendTo: user.id, isSeen: false }, { $set: { isSeen: true } })
    }
}