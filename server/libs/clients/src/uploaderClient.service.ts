import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Queue } from 'bullmq';
import { UPLOADER_SERVER_QUEUE } from "./clients.constants";
import { FileUploadJobData } from "@app/types/types/uploader";

@Injectable()
export class UploaderClient {
    constructor(
        @InjectQueue(UPLOADER_SERVER_QUEUE) private readonly uploaderQueue: Queue,
    ) { }

    async send(file: FileUploadJobData) {
        this.uploaderQueue.add('upload-file', file,
            {
                attempts: 3,
                backoff: { type: 'exponential', delay: 1000 },
                removeOnComplete: true,
            },
        );
    }
}