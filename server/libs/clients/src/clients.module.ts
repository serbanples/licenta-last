import { Global, Module } from '@nestjs/common';
import { ClientsModule as NestClientsModule } from '@nestjs/microservices';
import { AUTH_SERVER_NAME, AUTZ_SERVER_NAME, CORE_SERVER_NAME, MAIL_SERVER_QUEUE, UPLOADER_SERVER_QUEUE } from './clients.constants';
import { AuthProxyService } from './authProxy.service';
import { AutzProxyService } from './autzProxy.service';
import { MailClient } from './mailClient.service';
import { BullModule } from '@nestjs/bullmq';
import { BullConfService } from '@app/conf';
import { RabbitConfService } from '@app/conf/rabbitconf.service';
import { RegisterQueueAsyncOptions } from '@nestjs/bullmq';
import { CoreProxyService } from './coreProxy.service';
import { UploaderClient } from './uploaderClient.service';

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
    // BullModule.forRootAsync({
    //   inject: [BullConfService],
    //   useFactory: (bullConf: BullConfService) => bullConf.getMailQueueConf(),
    // }),
    BullModule.registerQueueAsync(
      {
        name: MAIL_SERVER_QUEUE,
        inject: [BullConfService],
        useFactory: (bullConf: BullConfService) => bullConf.getMailQueueConf(),
      },
      {
        name: UPLOADER_SERVER_QUEUE,
        inject: [BullConfService],
        useFactory: (bullConf: BullConfService) => bullConf.getUplaoderQueueConf(),
      },
    ),
  ],
  providers: [AuthProxyService, AutzProxyService, MailClient, CoreProxyService, UploaderClient],
  exports: [AuthProxyService, AutzProxyService, MailClient, CoreProxyService, UploaderClient],
})
export class ClientsModule { }
