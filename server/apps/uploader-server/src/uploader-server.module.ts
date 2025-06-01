import { Module } from '@nestjs/common';
import { UploaderServerService } from './uploader-server.service';

@Module({
  imports: [],
  providers: [UploaderServerService],
})
export class UploaderServerModule {}
