import { Global, Module } from '@nestjs/common';
import { ConfService } from './conf.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './configuration';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true, // Ignore .env files
      load: [configuration],
    })
  ],
  providers: [ConfService],
  exports: [ConfService],
})
export class ConfModule {}
