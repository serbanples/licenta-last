import { Injectable } from '@nestjs/common';

@Injectable()
export class MailServerService {
  getHello(): string {
    return 'Hello World!';
  }
}
