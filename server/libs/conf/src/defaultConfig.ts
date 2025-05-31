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
    redisMail: {
        host: string,
        port: number,
        db: number,
    },
    smtp: {
        host: string,
        port: number,
    },
    minio: {
        MINIO_ENDPOINT: string,
        MINIO_PORT: number,
        MINIO_USE_SSL: boolean,
        MINIO_ACCESS_KEY: string,
        MINIO_SECRET_KEY: string,
        MINIO_BUCKET_NAME: string,
        MINIO_REGION: string,
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
    redisMail: {
        host: 'localhost',
        port: 6379,
        db: 1
    },
    smtp: {
        host: 'localhost',
        port: 1025
    },
    minio: {
        MINIO_ENDPOINT: 'localhost',
        MINIO_PORT: 9000,
        MINIO_USE_SSL: false,
        MINIO_ACCESS_KEY: 'minio_access_key',
        MINIO_SECRET_KEY: 'minio_secret_key',
        MINIO_BUCKET_NAME: 'files',
        MINIO_REGION: 'us-east-1',
    },
};