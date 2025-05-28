import { Module } from '@nestjs/common';
import { AutzServerController } from './autz-server.controller';
import { AutzServerService } from './autz-server.service';

@Module({
  imports: [],
  controllers: [AutzServerController],
  providers: [AutzServerService],
})
export class AutzServerModule {}
