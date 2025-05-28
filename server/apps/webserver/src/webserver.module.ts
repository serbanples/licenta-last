import { Module } from '@nestjs/common';
import { ConfModule } from '@app/conf';
import { LoggerModule } from '@app/logger';
import { ClientsModule } from '@app/clients';
import { GuardModule, MiddlewareModule } from '@app/shared';
import { WebserverAuthController } from './controllers/webserver-aut.controller';

@Module({
  imports: [ConfModule, LoggerModule, ClientsModule, MiddlewareModule, GuardModule],
  controllers: [WebserverAuthController],
})
export class WebserverModule {}
