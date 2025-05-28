import { Module } from '@nestjs/common';
import { WebserverController } from './webserver.controller';
import { WebserverService } from './webserver.service';
import { ConfModule } from '@app/conf';
import { LoggerModule } from '@app/logger';
import { ClientsModule } from '@app/clients';

@Module({
  imports: [ConfModule, LoggerModule, ClientsModule],
  controllers: [WebserverController],
  providers: [WebserverService],
})
export class WebserverModule {}
