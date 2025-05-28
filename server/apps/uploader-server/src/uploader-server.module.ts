import { Module } from '@nestjs/common';
import { UploaderServerController } from './uploader-server.controller';
import { UploaderServerService } from './uploader-server.service';

@Module({
  imports: [],
  controllers: [UploaderServerController],
  providers: [UploaderServerService],
})
export class UploaderServerModule {}
