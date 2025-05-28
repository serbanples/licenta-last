import { Injectable } from '@nestjs/common';

@Injectable()
export class AutzServerService {
  getHello(): string {
    return 'Hello World!';
  }
}
