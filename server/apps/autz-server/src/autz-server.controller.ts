import { Controller, Get } from '@nestjs/common';
import { AutzServerService } from './autz-server.service';

@Controller()
export class AutzServerController {
  constructor(private readonly autzServerService: AutzServerService) {}

  @Get()
  getHello(): string {
    return this.autzServerService.getHello();
  }
}
