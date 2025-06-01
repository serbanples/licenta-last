import { Client as MinioClient } from "minio";
import { randomUUID } from 'crypto';
import { LoggerService } from "@app/logger";
import { CoreProxyService } from "@app/clients/coreProxy.service";

export abstract class AbstactUploader {
    protected bucketName: string;
    protected minioService: MinioClient;
    protected coreClient: CoreProxyService;
    protected logger: LoggerService

    constructor(bucketName: string, client: MinioClient, coreClient: CoreProxyService, logger: LoggerService) {
        this.bucketName = bucketName;
        this.minioService = client;
        this.coreClient = coreClient;
        this.logger = logger;
    }

    getPresignedUrl(filename: string) {
        return this.minioService.presignedUrl(
            "GET",
            this.bucketName,
            filename
        );
    }

    upload(file: Express.Multer.File) {
        const filename = `${randomUUID().toString()}-${file.originalname}`;
        return this.minioService.putObject(this.bucketName, filename, file.buffer, file.size)
        // .then(() => this.coreClient.updateUserProfilePhoto(filename))
    }

    protected async initBucket() {
        const exists = await this.minioService.bucketExists(this.bucketName).catch(() => false);
        if (!exists) {
            await this.minioService.makeBucket(this.bucketName, "");
            this.logger.log(`Created default bucket "${this.bucketName}"`);
        } else {
            this.logger.log(`Default bucket "${this.bucketName}" exists`);
        }
    }

}