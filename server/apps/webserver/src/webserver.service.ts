import { Public } from '@app/shared';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WebserverService {
  getHello(): string {
    return 'Hello World!';
  }
}
