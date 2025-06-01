import { NestFactory } from '@nestjs/core';
import { LoggerService } from '@app/logger';
import { UploaderServerModule } from './uploader-server.module';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(UploaderServerModule);

  const logger = appContext.get(LoggerService);
  logger.log('Uploader Microservice Started', {
    event: 'microservice_start',
    transport: 'BullMQ',
    queue: 'uploader-queue',
    environment: process.env['NODE_ENV'] ?? 'development',
    timestamp: new Date().toISOString(),
    version: process.env['npm_package_version'] ?? '1.0.0'
  });

}
bootstrap();
