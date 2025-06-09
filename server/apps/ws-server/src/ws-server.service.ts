import { CoreProxyService } from '@app/clients/coreProxy.service';
import { MessageCreateType, UserContextType } from '@app/types';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WsServerService {
  constructor(
    private readonly coreProxy: CoreProxyService
  ) {}

  createMessage(context: UserContextType, message: MessageCreateType) {
    const payload = {
      userContext: context,
      data: message
    }
    return firstValueFrom(this.coreProxy.createMessage(payload))
  }

  updateSeen() {}

  createReaction() {}

  findConversationById(context: UserContextType, conversationId: string) {
    const payload = {
      userContext: context,
      data: {
        _id: conversationId
      }
    }
    return firstValueFrom(this.coreProxy.browseConversations(payload)).then((conversations) => conversations.result[0] || null)
  }
}
