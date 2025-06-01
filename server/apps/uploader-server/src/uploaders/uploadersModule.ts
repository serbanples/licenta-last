import { Global, Module } from "@nestjs/common";
import { MinioModule } from "../minio/minio.module";
import { PhotoUploader } from "./photoUploader.service";
import { ProfilePhotoUploaderService } from "./profilePhotoUploader.service";
import { DocumentUploaderService } from "./documentUploader.service";

@Global()
@Module({
    imports: [MinioModule],
    providers: [PhotoUploader, ProfilePhotoUploaderService, DocumentUploaderService],
    exports: [PhotoUploader, ProfilePhotoUploaderService, DocumentUploaderService]
})
export class UploadersModule {}

