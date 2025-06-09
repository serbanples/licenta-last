import { NestFactory } from '@nestjs/core';
import { ConfService } from '@app/conf';
import { LoggerService } from '@app/logger';
import { AuthGuard } from '@app/shared';
import { NotificationServerModule } from './notification-server.module';
import { RmqOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(NotificationServerModule, { cors: {
        origin: 'http://localhost:4000',  // <-- your React app
        methods: ['GET', 'HEAD', 'OPTIONS'],
        credentials: true,                // <-- allow cookies
      },});
  const conf = app.get(ConfService);
  const logger = app.get(LoggerService);
  app.enableCors({
    origin: 'http://localhost:4000',    // your React app’s URL
    methods: ['GET', 'HEAD'],           // SSE uses GET (and HEAD for preflight)
    credentials: true,                  // allow cookies/auth headers
    allowedHeaders: ['Content-Type'],   // adjust as needed
    exposedHeaders: ['Content-Type'],   // headers your client might inspect
  });

  app.connectMicroservice<RmqOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'notification-queue',
      queueOptions: { durable: false },
    },
  });

  // 3) start BOTH the microservice(s) AND the HTTP listener
  await app.startAllMicroservices();  // brings up the RMQ consumer(s)
  await app.listen(conf.getOrDefault<number>('notification.port'));
  logger.log(`Webserver is running on port ${conf.getOrDefault<number>('notification.port')}`);
}
bootstrap();
