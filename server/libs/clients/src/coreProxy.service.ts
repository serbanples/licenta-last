import { Inject, Injectable } from "@nestjs/common";
import { CORE_SERVER_NAME } from "./clients.constants";
import { ClientProxy } from "@nestjs/microservices";
import { ConversationAddUser, ConversationBrowseFilter, ConversationCreateType, ConversationDeleteFilter, ConversationUpdateType, MessageBrowseFilter, MessageCreateType, MessageDeleteFilter, MessageUpdateType, WithContext } from "@app/types";
import { UserBrowseFilter, UserCreateType, UserDeleteType, UserUpdateType } from "@app/types/types/user";
import { conversationAddUser, conversationBrowse, conversationCreate, conversationDelete, conversationFindByID, conversationUpdate, fileBrowse, fileCreate, fileDelete, fileUpdate, messageBrowse, messageCreate, messageDelete, messageUpdate, notificationBrowse, notificationUpdateSeen, userAddFile, userBrowse, userCreate, userFindById, userSuggest, userUpdate } from "./messages.constants";
import { FileBrowseFilter, FileCreateType, FileDeleteFilter, FileUpdateType } from "@app/types/types/files";

@Injectable()
export class CoreProxyService {
    constructor(@Inject(CORE_SERVER_NAME) private readonly proxy: ClientProxy) {}

    browseUsers(payload: WithContext<UserBrowseFilter>) {
        return this.proxy.send(userBrowse, payload)
    }

    findByIdUser(paylaod: WithContext<string>) {
        return this.proxy.send(userFindById, paylaod);
    }

    createUser(payload: WithContext<UserCreateType>) {
        return this.proxy.send(userCreate, payload)
    }

    updateUser(payload: WithContext<UserUpdateType>) {
        return this.proxy.send(userUpdate, payload)
    }

    deleteUser(payload: WithContext<UserDeleteType>) {
        return this.proxy.send(userBrowse, payload)
    }

    suggestUser(payload: WithContext<UserBrowseFilter>) {
        return this.proxy.send(userSuggest, payload)
    }
    
    getNotifications(payload: WithContext<undefined>) {
        return this.proxy.send(notificationBrowse, payload)
    }

    updateSeenNotifications(payload: WithContext<undefined>) {
        return this.proxy.send(notificationUpdateSeen, payload)
    }

    findByIdConversations(payload: WithContext<string>) {
        return this.proxy.send(conversationFindByID, payload);
    }

    browseConversations(payload: WithContext<ConversationBrowseFilter>) {
        return this.proxy.send(conversationBrowse, payload);
    }

    createConversation(payload: WithContext<ConversationCreateType>) {
        return this.proxy.send(conversationCreate, payload);
    }

    updateConversation(payload: WithContext<ConversationUpdateType>) {
        return this.proxy.send(conversationUpdate, payload);
    }

    delteConversation(payload: WithContext<ConversationDeleteFilter>) {
        return this.proxy.send(conversationDelete, payload);
    }

    addUserToConversation(payload: WithContext<ConversationAddUser>) {
        return this.proxy.send(conversationAddUser, payload);
    }

    createMessage(payload: WithContext<MessageCreateType>) {
        return this.proxy.send(messageCreate, payload)
    }

    browseMessage(payload: WithContext<MessageBrowseFilter>) {
        return this.proxy.send(messageBrowse, payload)
    }

    updateMessage(payload: WithContext<MessageUpdateType>) {
        return this.proxy.send(messageUpdate, payload)
    }

    deleteMessage(payload: WithContext<MessageDeleteFilter>) {
        return this.proxy.send(messageDelete, payload)
    }

    createFile(payload: WithContext<FileCreateType>) {
        return this.proxy.send(fileCreate, payload);
    }

    updateFile(payload: WithContext<FileUpdateType>) {
        return this.proxy.send(fileUpdate, payload);
    }

    deleteFile(payload: WithContext<FileDeleteFilter>) {
        return this.proxy.send(fileDelete, payload);
    }

    browseFiles(payload: WithContext<FileBrowseFilter>) {
        return this.proxy.send(fileBrowse, payload);
    }

    addFileToUser(payload: WithContext<string>) {
        return this.proxy.send(userAddFile, payload)
    }
}