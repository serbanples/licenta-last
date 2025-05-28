import { Module } from '@nestjs/common';
import { WebserverController } from './webserver.controller';
import { WebserverService } from './webserver.service';
import { ConfModule } from '@app/conf';
import { LoggerModule } from '@app/logger';
import { ClientsModule } from '@app/clients';
import { GuardModule } from '@app/shared';
import { MiddlewareModule } from '@app/shared/middlewares/middleware.module';

@Module({
  imports: [ConfModule, LoggerModule, ClientsModule, MiddlewareModule, GuardModule],
  controllers: [WebserverController],
  providers: [WebserverService],
})
export class WebserverModule {}
