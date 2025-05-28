import { Controller, Get } from '@nestjs/common';
import { WsServerService } from './ws-server.service';

@Controller()
export class WsServerController {
  constructor(private readonly wsServerService: WsServerService) {}

  @Get()
  getHello(): string {
    return this.wsServerService.getHello();
  }
}
