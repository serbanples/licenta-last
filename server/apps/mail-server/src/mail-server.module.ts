import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { BullConfService, ConfModule, ConfService } from '@app/conf';
import { LoggerModule } from '@app/logger';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail-server.service';
import { MailProcessor } from './mail-server.processor';

@Module({
  imports: [
    ConfModule,
    LoggerModule,
    BullModule.forRootAsync({
      inject: [ConfService],
      useFactory: (conf: ConfService) => ({
        connection: {
          host: conf.getOrDefault<string>('redis.host'),
          port: conf.getOrDefault<number>('redis.port'),
          db: conf.getOrDefault<number>('redis.mailDb')
        }
      })
    }),
    BullModule.registerQueueAsync({
      inject: [BullConfService],
      useFactory: (bullConf: BullConfService) => bullConf.getMailQueueConf()
    }),
    MailerModule.forRootAsync({
      inject: [ConfService],
      useFactory: (conf: ConfService) => ({
        transport: {
          host: conf.getOrDefault<string>('smtp.host'),
          port: conf.getOrDefault<number>('smtp.port'),
          auth: undefined
        },
        defaults: {
          from: '"No Reply" <noreply@classcloud.com>'
        }
      })
    })
  ],
  controllers: [],
  providers: [MailService, MailProcessor],
})
export class MailServerModule {}
