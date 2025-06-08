import { Module } from '@nestjs/common';
import { NotificationServerController } from './notification-server.controller';
import { NotificationServerService } from './notification-server.service';
import { ConfModule } from '@app/conf';
import { LoggerModule } from '@app/logger';
import { ClientsModule } from '@app/clients';
import { DatabaseModule } from '@app/dbacc';

@Module({
  imports: [ConfModule, LoggerModule, ClientsModule, DatabaseModule],
  controllers: [NotificationServerController],
  providers: [NotificationServerService],
})
export class NotificationServerModule {}
