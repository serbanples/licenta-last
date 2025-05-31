import { Injectable } from "@nestjs/common";
import { ConfService } from "./conf.service";
import { ClientProvider, Transport } from "@nestjs/microservices";
import { RegisterQueueOptions } from "@nestjs/bullmq";
import { MAIL_SERVER_QUEUE } from "@app/clients";

@Injectable()
export class BullConfService {
    constructor(private readonly conf: ConfService) { }

    getMailQueueConf(): RegisterQueueOptions {
        return {
            name: MAIL_SERVER_QUEUE,
        }
    }
}