import { Module } from '@nestjs/common';
import { WsServerService } from './ws-server.service';
import { WsServerGateway } from './ws-server.gateway';
import { LoggerModule } from '@app/logger';
import { ConfModule } from '@app/conf';
import { ClientsModule } from '@app/clients';
import { GuardModule } from '@app/shared';

@Module({
  imports: [LoggerModule, ConfModule, ClientsModule, GuardModule],
  providers: [WsServerService, WsServerGateway],
})
export class WsServerModule {}
