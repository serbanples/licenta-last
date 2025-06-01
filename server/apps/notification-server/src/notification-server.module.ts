import { Module } from '@nestjs/common';
import { NotificationServerController } from './notification-server.controller';
import { NotificationServerService } from './notification-server.service';
import { ConfModule } from '@app/conf';
import { LoggerModule } from '@app/logger';
import { ClientsModule } from '@app/clients';

@Module({
  imports: [ConfModule, LoggerModule, ClientsModule],
  controllers: [NotificationServerController],
  providers: [NotificationServerService],
})
export class NotificationServerModule {}
