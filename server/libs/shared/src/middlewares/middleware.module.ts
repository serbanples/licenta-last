import { Global, Module } from "@nestjs/common";
import { LoggerMiddleware } from "./logger.middleware";

@Global()
@Module({
    providers: [LoggerMiddleware],
    exports: [LoggerMiddleware],
})
export class MiddlewareModule {}