import { Module } from '@nestjs/common';
import { AuthServerService } from './services/auth-server.service';
import { AuthServerController } from './auth-server.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfModule, ConfService } from '@app/conf';
import { DatabaseModule } from '@app/dbacc';
import { ClientsModule } from '@app/clients';
import { LoggerModule } from '@app/logger';

@Module({
  imports: [
    ConfModule,
    DatabaseModule,
    ClientsModule,
    LoggerModule,
    JwtModule.registerAsync({
      inject: [ConfService],
      useFactory: (conf: ConfService) => ({
        secret: 'secret key',
        signOptions: { expiresIn: '24h' }
      })
    })
  ],
  controllers: [AuthServerController],
  providers: [AuthServerService],
})
export class AuthServerModule { }
