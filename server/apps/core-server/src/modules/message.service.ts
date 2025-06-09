import { NotificationProxyService } from "@app/clients/notificationProxy.service";
import { MessageModel, MessageType } from "@app/dbacc";
import { MessageBrowseFilter, MessageCreateType, UserContextType } from "@app/types";
import { Injectable } from "@nestjs/common";
import * as _ from "lodash";

@Injectable()
export class MessageService {
    constructor(private readonly messageModel: MessageModel, private readonly sseClient: NotificationProxyService) { }

    getLastMessageForConversation(convId: string) {
        return this.messageModel.findLastForConv(convId).then((message) => message ? message : undefined)
    }

    countUnreadForConv(convId: string, userid: string) {
        return this.messageModel.count({ conversationId: convId, seenBy: { '$nin': [userid] } });
    }

    async browse(context: UserContextType, filter: MessageBrowseFilter) {
        const pagination = filter.pagination || {};
        const messages = await this.messageModel.findWithPagination(pagination, filter, true)

        this.markAllBrowsedAsSeen(context.id, filter.conversationId)

        return {
            ...messages,
            result: _.map(messages.result, (msg: any) => {
                if (msg.createdBy.id === context.id) {
                    msg.isSelf = true;
                } else {
                    msg.isSelf = false;
                }
                return msg;
            })
        }
    }

    create(userContext: UserContextType, body: MessageCreateType) {
        const message: Partial<MessageType> = {
            createdBy: userContext.id,
            text: body.text,
            conversationId: body.conversationId,
        }
        return this.messageModel.create(message).then((message) => {
            return this.messageModel.findOne({ _id: message.id }, {}, true);
        })
    }

    markAllBrowsedAsSeen(userId: string, conversationid: string) {
        return this.messageModel.updateMany({ conversationId: conversationid }, { '$addToSet': { seenBy: userId } } ).then((updated) => {
            console.log(updated);
            // if(updated.upsertedCount && updated.upsertedCount > 0)
            this.sseClient.sendUpdateUnreadEvent(userId, { conversationId: conversationid });
        })
    }
}