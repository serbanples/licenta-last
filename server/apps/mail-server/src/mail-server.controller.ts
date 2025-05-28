import { Controller, Get } from '@nestjs/common';
import { MailServerService } from './mail-server.service';

@Controller()
export class MailServerController {
  constructor(private readonly mailServerService: MailServerService) {}

  @Get()
  getHello(): string {
    return this.mailServerService.getHello();
  }
}
