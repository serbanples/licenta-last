import { Global, Module } from "@nestjs/common";
import { LoggerInterceptor } from "./logger.interceptor";

@Global()
@Module({
    providers: [LoggerInterceptor],
    exports: [LoggerInterceptor],
})
export class InterceptorModule {}