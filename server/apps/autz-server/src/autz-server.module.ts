import { Module } from '@nestjs/common';
import { AutzServerController } from './autz-server.controller';
import { AutzServerService } from './autz-server.service';
import { ConfModule } from '@app/conf';
import { LoggerModule } from '@app/logger';

@Module({
  imports: [ConfModule, LoggerModule],
  controllers: [AutzServerController],
  providers: [AutzServerService],
})
export class AutzServerModule {}
