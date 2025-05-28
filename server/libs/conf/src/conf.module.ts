import { Global, Module } from '@nestjs/common';
import { ConfService } from './conf.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './configuration';
import { RabbitConfService } from './rabbitconf.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true, // Ignore .env files
      load: [configuration],
    })
  ],
  providers: [ConfService, RabbitConfService],
  exports: [ConfService, RabbitConfService],
})
export class ConfModule {}
