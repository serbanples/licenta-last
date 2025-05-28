import { NestFactory } from '@nestjs/core';
import { MailServerModule } from './mail-server.module';

async function bootstrap() {
  const app = await NestFactory.create(MailServerModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
