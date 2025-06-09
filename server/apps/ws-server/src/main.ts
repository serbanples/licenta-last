import { NestFactory } from '@nestjs/core';
import { WsServerModule } from './ws-server.module';
import { LoggerService } from '@app/logger';
import { ConfService } from '@app/conf';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(WsServerModule);
  const logger = app.get(LoggerService);
  const config = app.get(ConfService);
  app.useWebSocketAdapter(new IoAdapter(app));
  app.enableCors({
    origin: '*',
    credentials: true,
  });
  const port = config.getOrDefault<number>('ws.port');
  await app.listen(port);
  logger.log('WebSocket Server Started', {
    event:       'ws_server_start',
    transport:   'Socket.IO',
    namespace:   'chat',
    port,
    url:         `ws://localhost:${port}/chat`,
    environment: process.env['NODE_ENV'] ?? 'development',
    timestamp:   new Date().toISOString(),
    version:     process.env['npm_package_version'] ?? '1.0.0',
  });
}
bootstrap().catch((error) => {
  console.error('Failed to start WebSocket Server', {
    event:   'ws_server_start_failed',
    error:   (error as Error).message,
    service: 'WsServer',
    timestamp: new Date().toISOString(),
  });
});
