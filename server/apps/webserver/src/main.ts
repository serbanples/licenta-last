import { NestFactory } from '@nestjs/core';
import { WebserverModule } from './webserver.module';
import { ConfService } from '@app/conf';
import { LoggerService } from '@app/logger';
import { AuthGuard } from '@app/shared';
import { join } from 'path';
import { Request, Response } from 'express';
import { GetOrResolveOptions } from '@nestjs/common/interfaces';

async function bootstrap() {
  const app = await NestFactory.create(WebserverModule);
  const conf = app.get(ConfService);
  const logger = app.get(LoggerService);
  app.setGlobalPrefix('api');
  app.useGlobalGuards(app.get(AuthGuard));
  await app.listen(conf.getOrDefault<number>('webserver.port'));

  logger.log(`Webserver is running on port ${conf.getOrDefault<number>('webserver.port')}`);
}
bootstrap();
