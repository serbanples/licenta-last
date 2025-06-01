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

@Processor(UPLOADER_SERVER_QUEUE)
@Injectable()
export class UploaderServerProcessor extends WorkerHost {
    constructor(
        private readonly photoUploader: PhotoUploader,
        private readonly documentUploader: DocumentUploaderService,
        private readonly profilePhotoUploader: ProfilePhotoUploaderService,
        private readonly logger: LoggerService,
    ) { super() }

    async process(job: Job<FileUploadJobData>): Promise<void> {
        let progress = 0;
        job.updateProgress(progress + 10);
        const { file, fileType } = job.data;
        job.updateProgress(progress + 10);

        this.logger.log('Starting process for job', { jobid: job.id, data: job.data });

        const interval = setInterval(() => {
            job.updateProgress(progress + 10)
        }, 20);

        return this.getUploaderByFileType(fileType).upload(file)
            .then(() => {
                clearInterval(interval);
                job.updateProgress(100);
                this.logger.log('File uploaded success', { jobid: job.id, data: job.data });
            })

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
        this.notify({ status: 'uploading', progress: job.progress });
    }

    @OnWorkerEvent('completed')
    onCompleted(job: Job<FileUploadJobData>) {
        this.logger.log('Job completed', { jobId: job.id });
        this.notify({ status: 'success' })
    }

    // Event listener: called when a job has failed (after retries if configured)
    @OnWorkerEvent('failed')
    onFailed(job: Job<FileUploadJobData>, error: Error) {
        this.logger.error('Job failed', { jobId: job.id }, error.stack);
        this.notify({ status: 'failed' })
    }

    private notify(notification: { status: 'uploading' | 'failed' | 'success', progress?: any }) {
        // call sse with updates
    }
}