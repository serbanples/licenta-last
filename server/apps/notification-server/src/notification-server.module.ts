import { Module } from '@nestjs/common';
import { NotificationServerController } from './notification-server.controller';
import { NotificationServerService } from './notification-server.service';

@Module({
  imports: [],
  controllers: [NotificationServerController],
  providers: [NotificationServerService],
})
export class NotificationServerModule {}
