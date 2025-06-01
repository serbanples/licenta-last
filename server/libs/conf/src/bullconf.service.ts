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
                host: this.conf.getOrDefault<string>('redis.host'),
                port: this.conf.getOrDefault<number>('redis.port'),
                db: this.conf.getOrDefault<number>('redis.mailDb'),
            },
        }
    }

    getUplaoderQueueConf() {
        return {
            connection: {
                host: this.conf.getOrDefault<string>('redis.host'),
                port: this.conf.getOrDefault<number>('redis.port'),
                db: this.conf.getOrDefault<number>('redis.uploaderDb'),
            },
        }
    }
}