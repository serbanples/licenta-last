import { NestFactory } from '@nestjs/core';
import { NotificationServerModule } from './notification-server.module';

async function bootstrap() {
  const app = await NestFactory.create(NotificationServerModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
