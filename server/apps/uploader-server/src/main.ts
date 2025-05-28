import { NestFactory } from '@nestjs/core';
import { UploaderServerModule } from './uploader-server.module';

async function bootstrap() {
  const app = await NestFactory.create(UploaderServerModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
