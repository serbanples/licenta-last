import { Global, Module } from '@nestjs/common';
import { ClientsModule as NestClientsModule } from '@nestjs/microservices';
import { RabbitConfService } from '@app/conf/rabbitconf.service';
import { AUTH_SERVER_NAME, AUTZ_SERVER_NAME, CORE_SERVER_NAME } from './clients.constants';
import { AuthProxyService } from './authProxy.service';
import { AutzProxyService } from './autzProxy.service';

@Global()
@Module({
  imports: [
    NestClientsModule.registerAsync([
      {
        name: AUTH_SERVER_NAME,
        useFactory: (rabbitConf: RabbitConfService) => rabbitConf.getAuthServerConfig(),
        inject: [RabbitConfService],
      },
      {
        name: CORE_SERVER_NAME,
        useFactory: (rabbitConf: RabbitConfService) => rabbitConf.getCoreServerConfig(),
        inject: [RabbitConfService],
      },
      {
        name: AUTZ_SERVER_NAME,
        useFactory: (rabbitConf: RabbitConfService) => rabbitConf.getAutzServerConfig(),
        inject: [RabbitConfService],
      }
    ]),
  ],
  providers: [AuthProxyService, AutzProxyService],
  exports: [AuthProxyService, AutzProxyService],
})
export class ClientsModule {}
