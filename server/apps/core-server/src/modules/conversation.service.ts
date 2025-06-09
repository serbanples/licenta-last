import { ConversationModel, ConversationType, UserModel, UserType } from "@app/dbacc";
import { ConversationBrowseFilter, ConversationCreateType, ConversationDeleteFilter, ConversationUpdateType, ResourceWithPagination, UserContextType } from "@app/types";
import { UserUpdateType } from "@app/types/types/user";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import * as  _ from "lodash";
import { MessageService } from "./message.service";
import * as Bluebird from "bluebird";

@Injectable()
export class ConverastionService {
    constructor(
        private readonly convsersationModel: ConversationModel,
        private readonly userModel: UserModel,
        private readonly mesageService: MessageService,
    ) { }

    browse(userContext: UserContextType, filter: ConversationBrowseFilter) {
        const formattedFilter: any = { ...filter, participants: userContext.id }
        const pagination = filter.pagination || {};
        return this.convsersationModel.findWithPagination(pagination, formattedFilter, true).then(async (conversations) => {
            return {
                ...conversations,
                result: await Bluebird.map(conversations.result, async (conv) => {
                    const participants: any = conv.participants.filter((participant: any) => participant.id !== userContext.id);
                    const lastMessage = await this.mesageService.getLastMessageForConversation(conv.id);
                    console.log(lastMessage);
                    const unreadCount = await this.mesageService.countUnreadForConv(conv.id, userContext.id);
                    console.log(unreadCount);
                    console.log(conv)

                    if (participants.length === 1 && (!conv.title || conv.title === '')) {
                        return { ...conv, title: participants[0].fullName, lastMessage, unreadCount }
                    }
                    if(participants.length > 1 && (!conv.title || conv.title === '')) {
                        const aaa = { ...conv, lastMessage, unreadCount, title: participants.map((user) => user.fullName).join(', ') };
                    // console.log(aaa);
                    return aaa;
                        return { ...conv, title: participants.map((user) => user.fullName).join(', '), lastMessage, unreadCount}
                    }
                    // return { ...conv, lastMessage, unreadCount };
                    const aaa = { ...conv, lastMessage, unreadCount };
                    // console.log(aaa);
                    return aaa;
                })
            }
        })
    }

    async create(usercontext: UserContextType, body: ConversationCreateType) {
        const participants = [...body.participants, usercontext.id];
        const users = await this.userModel.findMany({ _id: { '$in': participants } });
        if (users.length < 2) {
            throw new BadRequestException('cannot create conversation');
        }

        // const converationName = users.map((user) => user.fullName).join(', ');

        const conversation: Partial<ConversationType> = {
            participants: [...body.participants, usercontext.id],
            title: body.name,
            description: body.description,
        }

        return this.convsersationModel.create(conversation);
    }

    update(usercontext: UserContextType, body: ConversationUpdateType) {
        const updateBody = { ...body.updateBody };
        return this.convsersationModel.updateOne({ _id: body.id }, updateBody)
            .then((updatedUser) => {
                if (_.isNil(updatedUser)) {
                    throw new NotFoundException('Conversation not found');
                }

                return updatedUser;
            })
    }

    delete(filter: ConversationDeleteFilter) {
        return this.convsersationModel.deleteOne({ _id: filter.id });
    }

    async addUserToConversation(converationId: string, userId: string) {
        const user = await this.userModel.findOne({ _id: userId });
        if (!user) throw new NotFoundException('user not found');
        return this.convsersationModel.updateOne({ _id: converationId }, { '$addToSet': { participants: userId } });
    }
}