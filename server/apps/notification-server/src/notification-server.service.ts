import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationServerService {
  getHello(): string {
    return 'Hello World!';
  }
}
