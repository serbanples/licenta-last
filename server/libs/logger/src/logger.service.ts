import { ConfService } from '@app/conf';
import { Client } from '@elastic/elasticsearch';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerService extends Logger {
    private esClient: Client;
    private serviceName: string;
    private indexName: string;

    constructor(private readonly conf: ConfService) {
        super();
        this.serviceName = this.conf.getOrDefault<string>('service.name');
        this.indexName = this.conf.getOrDefault<string>('elasticsearch.indexName');


        this.initEsClient();
    }

    private initEsClient(): void {
        const nodeUrl = this.conf.getOrDefault<string>('elasticsearch.nodeUrl');
        const esVersion = this.conf.getOrDefault<string>('elasticsearch.esVersion');

        const acceptHeader = `application/vnd.elasticsearch+json; compatible-with=${esVersion}`;
        const contentTypeHeader = `application/vnd.elasticsearch+json; compatible-with=${esVersion}`;

        this.esClient = new Client({ 
            node: nodeUrl, 
            headers: {
                accept: acceptHeader,
                'content-type': contentTypeHeader,
            } 
        });
    }

    log(message: string, data?: any, context?: string) {
        const ctx = context ?? this.serviceName;
        super.log(message, ctx);
        this.index('log', message, ctx, data);
    }

    error(message: string, data?: any, trace?: string, context?: string) {
        const ctx = context ?? this.serviceName;
        super.error(message, trace, ctx);
        this.index('error', message, ctx, data, trace);
    }

    warn(message: string, data?: any, context?: string) {
        const ctx = context ?? this.serviceName;
        super.warn(message, ctx);
        this.index('warn', message, ctx, data);
    }

    debug(message: string, data?: any, context?: string) {
        const ctx = context ?? this.serviceName;
        super.debug(message, ctx);
        this.index('debug', message, ctx, data);
    }

    verbose(message: string, data?: any, context?: string) {
        const ctx = context ?? this.serviceName;
        super.verbose(message, ctx);
        this.index('verbose', message, ctx, data);
    }

    private async index(
        level: string,
        message: string,
        context: string,
        data?: any,
        trace?: string,
    ) {
        try {
            await this.esClient.index({
                index: this.indexName,
                document: {
                    timestamp: new Date().toISOString(),
                    service: this.serviceName,
                    level,
                    context,
                    message,
                    trace: trace || null,
                    ...data
                },
            });
        } catch (err: any) {
            // fallback to console error if ES is down
            super.error(
                `Failed to push log to Elasticsearch: ${err.message}`,
                err.stack,
                this.serviceName,
            );
        }
    }

}
