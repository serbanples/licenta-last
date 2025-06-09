import { CoreProxyService } from "@app/clients/coreProxy.service";
import { ConversationType, MessageType, UserType } from "@app/dbacc";
import { UserContext } from "@app/shared";
import { ConversationAddUser, ConversationBrowseFilter, ConversationCreateType, ConversationDeleteFilter, ConversationUpdateType, MessageBrowseFilter, ResourceWithPagination, UserContextType } from "@app/types";
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Req, UseGuards } from "@nestjs/common";
import { Observable, tap } from "rxjs";

@Controller('chat')
export class WebserverChatController {
    constructor(
        private readonly coreProxy: CoreProxyService
    ) { }

    @Post('conversations/browse')
    @HttpCode(HttpStatus.OK)
    browseConversations(@UserContext() user: UserContextType, @Body() filter: ConversationBrowseFilter): Observable<ResourceWithPagination<ConversationType>> {
        return this.coreProxy.browseConversations({ userContext: user, data: filter }).pipe(tap(console.log));
    }

    @Post('conversations/update')
    @HttpCode(HttpStatus.OK)
    updateConversations(@UserContext() user: UserContextType, @Body() body: ConversationUpdateType): Observable<ConversationType> {
        return this.coreProxy.updateConversation({ userContext: user, data: body });
    }

    @Post('conversations/create')
    @HttpCode(HttpStatus.OK)
    createConversation(@UserContext() user: UserContextType, @Body() data: ConversationCreateType): Observable<ConversationType> {
        return this.coreProxy.createConversation({ userContext: user, data: data });
    }

    @Post('conversations/delete')
    @HttpCode(HttpStatus.OK)
    deleteConversation(@UserContext() user: UserContextType, @Body() data: ConversationDeleteFilter) {
        return this.coreProxy.delteConversation({ userContext: user, data: data });
    }

    @Post('conversations/addUser')
    @HttpCode(HttpStatus.OK)
    addUserToConversation(@UserContext() user: UserContextType, @Body() data: ConversationAddUser) {
        return this.coreProxy.addUserToConversation({ userContext: user, data: data });
    }

    @Post('messages/browse')
    @HttpCode(HttpStatus.OK)
    browseMessages(@UserContext() user: UserContextType, @Body() data: MessageBrowseFilter) {
        return this.coreProxy.browseMessage({ userContext: user, data: data });
    }
}