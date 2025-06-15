import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfModule } from '@app/conf';
import { LoggerModule } from '@app/logger';
import { ClientsModule } from '@app/clients';
import { GuardModule, LoggerMiddleware, MiddlewareModule } from '@app/shared';
import { WebserverAuthController } from './controllers/webserver-aut.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { WebserverUserController } from './controllers/webserver-user.controller';
import { WebserverNotifController } from './controllers/webserver-notif.controler';
import { WebserverChatController } from './controllers/webserver-chat.controller';
import { WebserverFileController } from './controllers/webserver-file.controller';

@Module({
  imports: [
    ConfModule, 
    LoggerModule, 
    ClientsModule, 
    MiddlewareModule, 
    GuardModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../../../../../', 'client/dist'),
      // serveRoot: '/',
      exclude: ['/api*'],
    }),
  ],
  controllers: [WebserverAuthController, WebserverUserController, WebserverNotifController, WebserverChatController, WebserverFileController],
})
export class WebserverModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
