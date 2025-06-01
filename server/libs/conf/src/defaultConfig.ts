export interface AppConfig {
    rabbitmq: {
        uri: string;
        authQueue: string;
        coreQueue: string;
        autzQueue: string;
    };
    webserver: {
        port: number;
    }
    mongodb: {
        uri: string;
    };
    port: number;
    elasticsearch: {
        nodeUrl: string;
        indexName: string;
        esVersion: 7 | 8; // Optional, can be used to specify the Elasticsearch version
    };
    service: {
        name: string;
    },
    redis: {
        host: string,
        port: number,
        mailDb: number,
        uploaderDb: number,
    },
    smtp: {
        host: string,
        port: number,
    },
    minio: {
        endpoint: string,
        port: number,
        useSsl: boolean,
        accesskey: string,
        secretkey: string,
    },
    token: {
        expiration: number
    }

}

export const defaultConfig: AppConfig = {
    rabbitmq: {
        uri: 'amqp://localhost:5672',
        authQueue: 'auth-queue',
        coreQueue: 'core-queue',
        autzQueue: 'autz-queue'
    },
    webserver: {
        port: 3000,
    },
    mongodb: {
        uri: 'mongodb://localhost:27017/mydb',
    },
    port: 3000,
    elasticsearch: {
        nodeUrl: 'http://localhost:9200',
        indexName: 'logs',
        esVersion: 8
    },
    service: {
        name: 'default-service',
    },
    redis: {
        host: 'localhost',
        port: 6379,
        mailDb: 1,
        uploaderDb: 2,
    },
    smtp: {
        host: 'localhost',
        port: 1025
    },
    minio: {
        endpoint: 'localhost',
        port: 9000,
        useSsl: false,
        accesskey: 'minio_access_key',
        secretkey: 'minio_secret_key',
    },
    token: {
        expiration: 5 * 60,
    }
};