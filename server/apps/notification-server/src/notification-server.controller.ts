import { Controller, Get } from '@nestjs/common';
import { NotificationServerService } from './notification-server.service';

@Controller()
export class NotificationServerController {
  constructor(private readonly notificationServerService: NotificationServerService) {}

  @Get()
  getHello(): string {
    return this.notificationServerService.getHello();
  }
}
