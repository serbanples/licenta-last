import { UserContextType } from "./general";

// src/file-upload/file-type.enum.ts
export enum FileTypeEnum {
  PROFILE   = "PROFILE",
  PICTURE   = "PICTURE",
  DOCUMENT  = "DOCUMENT",
}

export interface FileUploadJobData {
    file: Express.Multer.File,
    fileType: FileTypeEnum,
    metadata: { name: string, description: string}
    userContext: UserContextType,
}