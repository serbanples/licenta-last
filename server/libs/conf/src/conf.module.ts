import { Global, Module } from '@nestjs/common';
import { ConfService } from './conf.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './configuration';
import { RabbitConfService } from './rabbitconf.service';
import { BullConfService } from './bullconf.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true, // Ignore .env files
      load: [configuration],
    })
  ],
  providers: [ConfService, RabbitConfService, BullConfService],
  exports: [ConfService, RabbitConfService, BullConfService],
})
export class ConfModule {}
