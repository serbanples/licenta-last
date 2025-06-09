import { LoggerService } from '@app/logger';
import { WsUserContext } from '@app/shared';
import { MessageCreateType, UserContextType } from '@app/types';
import { ForbiddenException, NotFoundException, UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsServerService } from './ws-server.service';
import { ConversationType } from '@app/dbacc';
import { WsAuthGuard } from '@app/shared/guards/ws-auth.guard';

@UseGuards(WsAuthGuard)
@WebSocketGateway({
    namespace: 'chat',
    cors: { origin: '*' }
})
export class WsServerGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private readonly logger: LoggerService,
        private readonly wsServerService: WsServerService
    ) { }

    @WebSocketServer() server: Server;

    handleConnection(@ConnectedSocket() client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(@ConnectedSocket() client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    afterInit() {
        this.logger.log('WebSocket Gateway initialzied');
    }

    @SubscribeMessage('send-message')
    async handleMessage(@MessageBody() message: MessageCreateType, @ConnectedSocket() socket: Socket, @WsUserContext() user: UserContextType) {
        console.log('got send');
        const createdMessage = await this.wsServerService.createMessage(user, message);
        console.log(createdMessage);
        // 3) emit back to *just* the sender with isSelf=true
        socket.emit('recieve-message', {
            ...createdMessage,
            isSelf: true,
        });

        // 4) broadcast to everyone *else* in the room with isSelf=false
        socket
            .broadcast                // don’t hit the sender
            .to(createdMessage.conversationId) // only within this conversation-room
            .emit('recieve-message', {
                ...createdMessage,
                isSelf: false,
            });
    }

    @SubscribeMessage('send-reaction')
    handleReaction(@MessageBody('messageId') messageId: string, @ConnectedSocket() socket: Socket, @WsUserContext() userid: UserContextType) {

    }

    @SubscribeMessage('send-typing')
    handleTyping(@MessageBody() message: any, @ConnectedSocket() socket: Socket, @WsUserContext() userid: UserContextType) {

    }

    @SubscribeMessage('send-seen')
    handleSeen(@MessageBody() message: any, @ConnectedSocket() socket: Socket, @WsUserContext() userid: UserContextType) {

    }

    @SubscribeMessage('join-conversation')
    async handleJoin(@MessageBody('conversationId') conversationId: string, @ConnectedSocket() socket: Socket, @WsUserContext() userContext: UserContextType) {
        const conversation: ConversationType | null = await this.wsServerService.findConversationById(userContext, conversationId)
        if (!conversation) { throw new NotFoundException('Converastion Not Found!') }
        if (!conversation.participants.map(id => id.toString().includes(userContext.id))) throw new ForbiddenException('Not a participant of this converation');

        socket.join(conversationId);
        socket.emit('joined-conversation', { conversationId })
    }

    @SubscribeMessage('leave-conversation')
    handleLeave(@MessageBody('conversationId') conversationId: string, @ConnectedSocket() socket: Socket, @WsUserContext('id') userid: string) {
        console.log(conversationId, userid)
    }


}