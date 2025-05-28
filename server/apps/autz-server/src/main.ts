import { NestFactory } from '@nestjs/core';
import { AutzServerModule } from './autz-server.module';

async function bootstrap() {
  const app = await NestFactory.create(AutzServerModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
