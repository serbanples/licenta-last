import { InjectMinio } from "@app/shared";
import { AbstactUploader } from "./abstractUploader";
import { Client } from "minio";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { LoggerService } from "@app/logger";
import { CoreProxyService } from "@app/clients/coreProxy.service";

@Injectable()
export class ProfilePhotoUploaderService extends AbstactUploader implements OnModuleInit {
    constructor(@InjectMinio() minioClient: Client, coreServer: CoreProxyService, logger: LoggerService) {
        super('profile-photos-bucket', minioClient, coreServer, logger);
    }

    async onModuleInit() {
        await this.initBucket();
    }
}