import { Injectable } from "@nestjs/common";
import { ConfService } from "./conf.service";
import { ClientProvider, Transport } from "@nestjs/microservices";
import { RegisterQueueOptions } from "@nestjs/bullmq";
import { MAIL_SERVER_QUEUE } from "@app/clients";

@Injectable()
export class BullConfService {
    constructor(private readonly conf: ConfService) { }

    getMailQueueConf() {
        return {
            connection: {
                host: this.conf.getOrDefault<string>('redisMail.host'),
                port: this.conf.getOrDefault<number>('redisMail.port'),
                db: this.conf.getOrDefault<number>('redisMail.db'),
            },
        }
    }
}