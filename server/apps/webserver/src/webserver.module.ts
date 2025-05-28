import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfModule } from '@app/conf';
import { LoggerModule } from '@app/logger';
import { ClientsModule } from '@app/clients';
import { GuardModule, LoggerMiddleware, MiddlewareModule } from '@app/shared';
import { WebserverAuthController } from './controllers/webserver-aut.controller';

@Module({
  imports: [ConfModule, LoggerModule, ClientsModule, MiddlewareModule, GuardModule],
  controllers: [WebserverAuthController],
})
export class WebserverModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
