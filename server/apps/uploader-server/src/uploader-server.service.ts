import { Injectable } from '@nestjs/common';

@Injectable()
export class UploaderServerService {
  getHello(): string {
    return 'Hello World!';
  }
}
