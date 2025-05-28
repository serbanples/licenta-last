export interface AppConfig {
    rabbitmq: {
        uri: string;
        authQueue: string;
        coreQueue: string;
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

}

export const defaultConfig: AppConfig = {
    rabbitmq: {
        uri: 'amqp://localhost:5672',
        authQueue: 'auth-queue',
        coreQueue: 'core-queue',
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

};