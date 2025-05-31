import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import { LoggerService } from '@app/logger';
import { AutzServerModule } from './autz-server.module';

/* eslint-disable no-console */

/** Start method for Authorization Microservice */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AutzServerModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'autz-queue',
      queueOptions: {
        durable: false,
      }
    }
  });

  const logger = app.get(LoggerService);

  await app.listen();

  logger.log('Authorization Microservice Started', {
    event: 'microservice_start',
    transport: 'RabbitMQ',
    queue: 'autz-queue',
    url: 'amqp://localhost:5672',
    environment: process.env['NODE_ENV'] ?? 'development',
    timestamp: new Date().toISOString(),
    version: process.env['npm_package_version'] ?? '1.0.0'
  });
}
bootstrap().catch((error) => {
  console.error('Failed to start Authorization Microservice', {
    event: 'microservice_start_failed',
    error: (error as Error).message,
    timestamp: new Date().toISOString(),
    service: 'AuthServer'
  });
});
