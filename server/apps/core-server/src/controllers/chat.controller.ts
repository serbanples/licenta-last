import { conversationAddUser, conversationBrowse, conversationCreate, conversationDelete, conversationUpdate, messageBrowse, messageCreate } from "@app/clients";
import { Authorize, LoggerInterceptor, PayloadData, PayloadUserContext, RpcErrorEncoder } from "@app/shared";
import { ConversationAddUser, ConversationBrowseFilter, ConversationCreateType, ConversationDeleteFilter, ConversationUpdateType, MessageBrowseFilter, MessageCreateType, UserContextType } from "@app/types";
import { Controller, UseInterceptors } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { ConverastionService } from "../modules/conversation.service";
import { MessageService } from "../modules/message.service";

@UseInterceptors(LoggerInterceptor)
@Controller()
export class ChatController {
    constructor(private readonly conversationService: ConverastionService, private readonly messageService: MessageService) {}

    @MessagePattern(conversationBrowse)
    @Authorize('browse', 'conversation')
    @RpcErrorEncoder()
    browseConversations(@PayloadUserContext() user: UserContextType, @PayloadData() filter: ConversationBrowseFilter) {
        return this.conversationService.browse(user, filter);
    }

    @MessagePattern(conversationCreate)
    @Authorize('create', 'conversation')
    @RpcErrorEncoder()
    createConvsersation(@PayloadUserContext() user: UserContextType, @PayloadData() body: ConversationCreateType) {
        return this.conversationService.create(user, body);
    }
    
    @MessagePattern(conversationUpdate)
    @Authorize('update', 'conversation')
    @RpcErrorEncoder()
    updateConversation(@PayloadUserContext() user: UserContextType, @PayloadData() body: ConversationUpdateType) {
        return this.conversationService.update(user, body);
    }

    @MessagePattern(conversationDelete)
    @Authorize('delete', 'conversation')
    @RpcErrorEncoder()
    deleteConversation(@PayloadUserContext() user: UserContextType, @PayloadData() filter: ConversationDeleteFilter) {
        return this.conversationService.delete(filter);
    }

    @MessagePattern(conversationAddUser)
    @Authorize('addUser', 'conversation')
    @RpcErrorEncoder()
    addUserToConversation(@PayloadUserContext() user: UserContextType, @PayloadData() filter: ConversationAddUser) {
        return this.conversationService.addUserToConversation(filter.conversationId, filter.userId);
    }

    @MessagePattern(messageBrowse)
    @Authorize('browse', 'message')
    @RpcErrorEncoder()
    browseMessages(@PayloadUserContext() user: UserContextType, @PayloadData() filter: MessageBrowseFilter) {
        return this.messageService.browse(user, filter);
    }

    @MessagePattern(messageCreate)
    @Authorize('create', 'message')
    @RpcErrorEncoder()
    createMessage(@PayloadUserContext() user: UserContextType, @PayloadData() body: MessageCreateType) {
        return this.messageService.create(user, body);
    }
}