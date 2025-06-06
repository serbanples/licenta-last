import { ClientsModule } from '@app/clients';
import { ConfModule } from '@app/conf';
import { DatabaseModule } from '@app/dbacc';
import { LoggerModule } from '@app/logger';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    ConfModule,
    LoggerModule,
    ClientsModule,
    DatabaseModule
  ],
  controllers: [],
  providers: []
})
export class CoreServerModule {}
