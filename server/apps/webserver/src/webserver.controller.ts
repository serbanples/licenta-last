import { Controller, Get } from '@nestjs/common';
import { WebserverService } from './webserver.service';
import { Public } from '@app/shared';

@Controller()
export class WebserverController {
  constructor(private readonly webserverService: WebserverService) {}

  // @Public()
  @Get()
  getHello(): string {
    return this.webserverService.getHello();
  }
}
