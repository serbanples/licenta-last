import { Module } from '@nestjs/common';
import { DbaccService } from './dbacc.service';

@Module({
  providers: [DbaccService],
  exports: [DbaccService],
})
export class DbaccModule {}
