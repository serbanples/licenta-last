import { ConfModule } from "@app/conf";
import { Module } from "@nestjs/common";
import { UploadersModule } from "./uploaders/uploadersModule";
import { UploaderServerProcessor } from "./uploader-server.processor";
import { ClientsModule } from "@app/clients";
import { LoggerModule } from "@app/logger";

@Module({
    imports: [ConfModule, UploadersModule, ClientsModule, LoggerModule],
    providers: [UploaderServerProcessor]
})
export class UplaoderServerModule {}