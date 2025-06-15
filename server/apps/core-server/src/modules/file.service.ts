import { FileModel, FileType } from "@app/dbacc";
import { UserContextType } from "@app/types";
import { FileBrowseFilter, FileCreateType, FileDeleteFilter, FileUpdateType } from "@app/types/types/files";
import { Injectable, NotFoundException } from "@nestjs/common";
import * as _ from "lodash";

@Injectable()
export class FileService {
    constructor(private readonly fileModel: FileModel) { }

    browse(user: UserContextType, filter: FileBrowseFilter) {
        const pagination = filter.pagination || {};
        return this.fileModel.findWithPagination(pagination, filter, true);
    }

    create(user: UserContextType, body: FileCreateType) {
        console.log(body.name)
        const fileData: Partial<FileType> = {
            name: body.name,
            description: body.description,
            size: body.size,
            mimeType: body.mimeType,
            fileURL: body.URL,
            uploadedBy: user.id,
            fileType: body.fileType,
        }
        return this.fileModel.create(fileData);
    }

    update(usercontext: UserContextType, body: FileUpdateType) {
        const updateBody = { ...body.updateBody };
        return this.fileModel.updateOne({ _id: body.id }, updateBody)
            .then((updatedUser) => {
                if (_.isNil(updatedUser)) {
                    throw new NotFoundException('File not found');
                }

                return updatedUser;
            })
    }

    delete(filter: FileDeleteFilter) {
        return this.fileModel.deleteOne({ _id: filter.id });
    }
}