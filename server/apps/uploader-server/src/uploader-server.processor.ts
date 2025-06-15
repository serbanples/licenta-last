import { UPLOADER_SERVER_QUEUE } from "@app/clients";
import { FileTypeEnum, FileUploadJobData } from "@app/types/types/uploader";
import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Job } from "bullmq";
import { PhotoUploader } from "./uploaders/photoUploader.service";
import { DocumentUploaderService } from "./uploaders/documentUploader.service";
import { ProfilePhotoUploaderService } from "./uploaders/profilePhotoUploader.service";
import { AbstactUploader } from "./uploaders/abstractUploader";
import { LoggerService } from "@app/logger";
import { CoreProxyService } from "@app/clients/coreProxy.service";
import { UserContextType, WithContext } from "@app/types";
import { FileCreateType } from "@app/types/types/files";
import { firstValueFrom } from "rxjs";
import { NotificationProxyService } from "@app/clients/notificationProxy.service";

@Processor(UPLOADER_SERVER_QUEUE)
@Injectable()
export class UploaderServerProcessor extends WorkerHost {
    constructor(
        private readonly photoUploader: PhotoUploader,
        private readonly documentUploader: DocumentUploaderService,
        private readonly profilePhotoUploader: ProfilePhotoUploaderService,
        private readonly logger: LoggerService,
        private readonly coreProxy: CoreProxyService,
        private readonly sseProxy: NotificationProxyService,
    ) { super() }

    async process(job: Job<FileUploadJobData>): Promise<void> {
        job.updateProgress(20);
        const { file, fileType, metadata } = job.data;
        const meta = JSON.parse(metadata as unknown as string);
        job.updateProgress(30);

        this.logger.log('Starting process for job', { jobid: job.id, data: job.data });

        // const interval = setInterval(() => {
        //     job.updateProgress()
        // }, 100);

        return this.getUploaderByFileType(fileType).upload(file, meta)
            .then(async (documentUrl) => {
                job.updateProgress(70);
                // clearInterval(interval);
                const fileId = await this.createFileMetadata(job.data.userContext, fileType, file, documentUrl, meta!);
                job.updateProgress(80)
                await this.addFileToUser(job.data.userContext, fileId);
                job.updateProgress(100);
                this.logger.log('File uploaded success', { jobid: job.id, data: job.data });
            })
            .catch((err) => { console.log('nu merge?', err); throw err })

    }

    private getUploaderByFileType(fileType: FileTypeEnum): AbstactUploader {
        switch (fileType) {
            case FileTypeEnum.PROFILE:
                return this.profilePhotoUploader;
            case FileTypeEnum.PICTURE:
                return this.photoUploader;
            case FileTypeEnum.DOCUMENT:
                return this.documentUploader;
        }
    }

    @OnWorkerEvent('progress')
    onWorkerProgress(job: Job<FileUploadJobData>) {
        this.logger.log('Upload progress increased', { jobid: job.id, data: job.data, progress: job.progress })
        this.notify({ status: 'uploading', progress: job.progress }, job.data.userContext.id);
    }

    @OnWorkerEvent('completed')
    onCompleted(job: Job<FileUploadJobData>) {
        this.logger.log('Job completed', { jobId: job.id });
        this.notify({ status: 'success' }, job.data.userContext.id)
    }

    // Event listener: called when a job has failed (after retries if configured)
    @OnWorkerEvent('failed')
    onFailed(job: Job<FileUploadJobData>, error: Error) {
        this.logger.error('Job failed', { jobId: job.id }, error.stack);
        this.notify({ status: 'failed' }, job.data.userContext.id)
    }

    private notify(notification: { status: 'uploading' | 'failed' | 'success', progress?: any }, userid: string) {
        this.sseProxy.sendUploaderEvent(userid, notification);
    }

    private async createFileMetadata(usercontext: UserContextType, fileType: FileTypeEnum, file: Express.Multer.File, url: string, metadata: {name: string, description: string}): Promise<string> {
        console.log(metadata.name)
        console.log(metadata['name'])
        const payload: WithContext<FileCreateType> = {
            userContext: usercontext,
            data: {
                fileType: fileType,
                size: file.size, // will be updated later
                URL: url, // will be updated later
                name: metadata.name, // will be updated later
                description: metadata?.description, // will be updated later
                mimeType: file.mimetype, // will be updated later
            }
        }

        console.log(payload.data)

        
        const createdFile = await firstValueFrom(this.coreProxy.createFile(payload)).catch(console.error);

        return createdFile.id;
    }

    private async addFileToUser(usercontext: UserContextType, fileId: string) {
        const payload: WithContext<string> = {
            userContext: usercontext,
            data: fileId
        }

        await firstValueFrom(this.coreProxy.addFileToUser(payload)).catch(console.error);
    }
}