import { FileType } from "@app/dbacc";
import { with_pagination, with_populate, with_text } from "./db";
import { FileTypeEnum } from "./uploader";

export interface FileBrowseFilter extends with_pagination, with_text, with_populate {
    _id?: string;
}

export interface FileCreateType {
    URL: string;
    description?: string;
    name: string;
    size: number;
    mimeType: string;
    fileType: FileTypeEnum;
}

export interface FileUpdateType {
    id: string;
    updateBody: Partial<FileType>
}

export interface FileDeleteFilter {
    id: string;
}