import { ClientsModule } from '@app/clients';
import { ConfModule } from '@app/conf';
import { DatabaseModule } from '@app/dbacc';
import { LoggerModule } from '@app/logger';
import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './modules/user.service';
import { GuardModule } from '@app/shared';
import { NotificationController } from './controllers/notif.contoller';
import { NotificationService } from './modules/notification.service';
import { ChatController } from './controllers/chat.controller';
import { ConverastionService } from './modules/conversation.service';
import { MessageService } from './modules/message.service';

@Module({
  imports: [
    ConfModule,
    LoggerModule,
    ClientsModule,
    DatabaseModule,
    GuardModule
  ],
  controllers: [UserController, NotificationController, ChatController],
  providers: [UserService, NotificationService, ConverastionService, MessageService]
})
export class CoreServerModule {}
