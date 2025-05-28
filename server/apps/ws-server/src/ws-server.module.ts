import { Module } from '@nestjs/common';
import { WsServerController } from './ws-server.controller';
import { WsServerService } from './ws-server.service';

@Module({
  imports: [],
  controllers: [WsServerController],
  providers: [WsServerService],
})
export class WsServerModule {}
