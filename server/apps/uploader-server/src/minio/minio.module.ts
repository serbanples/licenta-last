import { ConfService } from '@app/conf';
import { MINIO_TOKEN } from '@app/shared';
import { Global, Module } from '@nestjs/common';
import * as Minio from 'minio';

@Global()
@Module({
  exports: [MINIO_TOKEN],
  providers: [
    {
      inject: [ConfService],
      provide: MINIO_TOKEN,
      useFactory: async (
        conf: ConfService,
      ): Promise<Minio.Client> => {
        const client = new Minio.Client({
          endPoint: conf.getOrDefault<string>("minio.endpoint"),
          port: conf.getOrDefault<number>("minio.port"),
          accessKey: conf.getOrDefault<string>("minio.accesskey"),
          secretKey: conf.getOrDefault<string>("minio.secretkey"),
          useSSL: false,
        });
        return client;
      },
    },
  ],
})
export class MinioModule {}