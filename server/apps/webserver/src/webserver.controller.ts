import { Controller, Get } from '@nestjs/common';
import { WebserverService } from './webserver.service';

@Controller()
export class WebserverController {
  constructor(private readonly webserverService: WebserverService) {}

  @Get()
  getHello(): string {
    return this.webserverService.getHello();
  }
}
