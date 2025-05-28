import { Module } from '@nestjs/common';
import { MailServerController } from './mail-server.controller';
import { MailServerService } from './mail-server.service';

@Module({
  imports: [],
  controllers: [MailServerController],
  providers: [MailServerService],
})
export class MailServerModule {}
