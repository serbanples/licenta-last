import { Controller, Get } from '@nestjs/common';
import { UploaderServerService } from './uploader-server.service';

@Controller()
export class UploaderServerController {
  constructor(private readonly uploaderServerService: UploaderServerService) {}

  @Get()
  getHello(): string {
    return this.uploaderServerService.getHello();
  }
}
