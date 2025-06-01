import { Injectable, OnModuleInit } from "@nestjs/common";
import { AbstactUploader } from "./abstractUploader";
import { InjectMinio } from "@app/shared";
import { Client } from "minio";
import { LoggerService } from "@app/logger";
import { CoreProxyService } from "@app/clients/coreProxy.service";

@Injectable()
export class DocumentUploaderService extends AbstactUploader implements OnModuleInit {
    constructor(@InjectMinio() minioClient: Client, coreServer: CoreProxyService, logger: LoggerService) {
        super("documents-bucket", minioClient, coreServer, logger);
    }

    async onModuleInit() {
        await this.initBucket();
    }
}