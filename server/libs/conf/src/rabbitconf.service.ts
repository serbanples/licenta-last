import { Injectable } from "@nestjs/common";
import { ConfService } from "./conf.service";
import { ClientProvider, Transport } from "@nestjs/microservices";

@Injectable()
export class RabbitConfService {
    constructor(private readonly conf: ConfService) { }

    getAuthServerConfig(): ClientProvider {
        return {
            transport: Transport.RMQ,
            options: {
                urls: [this.conf.getOrDefault<string>('rabbitmq.uri')],
                queue: this.conf.getOrDefault<string>('rabbitmq.authQueue'),
                queueOptions: { durable: false },
            },
        }
    }

    getCoreServerConfig(): ClientProvider {
        return {
            transport: Transport.RMQ,
            options: {
                urls: [this.conf.getOrDefault<string>('rabbitmq.uri')],
                queue: this.conf.getOrDefault<string>('rabbitmq.coreQueue'),
                queueOptions: { durable: false },
            },
        }
    }

    getAutzServerConfig(): ClientProvider {
        return {
            transport: Transport.RMQ,
            options: {
                urls: [this.conf.getOrDefault<string>('rabbitmq.uri')],
                queue: this.conf.getOrDefault<string>('rabbitmq.autzQueue'),
                queueOptions: { durable: false },
            },
        }
    }

    getNotificationServerConfig(): ClientProvider {
        return {
            transport: Transport.RMQ,
            options: {
                urls: [this.conf.getOrDefault<string>('rabbitmq.uri')],
                queue: this.conf.getOrDefault<string>('rabbitmq.notificationQueue'),
                queueOptions: { durable: false },
            },
        }
    }
}