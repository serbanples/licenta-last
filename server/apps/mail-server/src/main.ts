import { NestFactory } from '@nestjs/core';
import { MailServerModule } from './mail-server.module';
import { LoggerService } from '@app/logger';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(MailServerModule);

  const logger = appContext.get(LoggerService);
  logger.log('Mail Microservice Started', {
    event: 'microservice_start',
    transport: 'BullMQ',
    queue: 'mail-queue',
    environment: process.env['NODE_ENV'] ?? 'development',
    timestamp: new Date().toISOString(),
    version: process.env['npm_package_version'] ?? '1.0.0'
  });

}
bootstrap();
