import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { MAIL_SERVER_QUEUE } from "./clients.constants";
import { Queue } from 'bullmq';
import { MailJobData } from "@app/types";

@Injectable()
export class MailClient {
    constructor(
        @InjectQueue(MAIL_SERVER_QUEUE) private readonly mailQueue: Queue,
    ) { }

    async send(mail: MailJobData) {
        this.mailQueue.add('send-mail', mail,
            {
                attempts: 3,
                backoff: { type: 'exponential', delay: 1000 },
                removeOnComplete: true,
            },
        );
    }
}