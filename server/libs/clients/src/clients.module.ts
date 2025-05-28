import { Module } from '@nestjs/common';
import { ClientsModule as NestClientsModule } from '@nestjs/microservices';
import { RabbitConfService } from '@app/conf/rabbitconf.service';
import { AUTH_SERVER_NAME, CORE_SERVER_NAME } from './clients.constants';
import { AuthProxyService } from './authProxy.service';


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
      }
    ]),
  ],
  providers: [AuthProxyService],
  exports: [AuthProxyService],
})
export class ClientsModule {}
