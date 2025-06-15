import { fileBrowse, fileCreate, fileDelete, fileUpdate, notificationBrowse, notificationUpdateSeen } from "@app/clients";
import { Authorize, PayloadData, PayloadUserContext, RpcErrorEncoder } from "@app/shared";
import { UserContextType } from "@app/types";
import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { NotificationService } from "../modules/notification.service";
import { FileService } from "../modules/file.service";
import { FileBrowseFilter, FileCreateType, FileDeleteFilter, FileUpdateType } from "@app/types/types/files";

@Controller()
export class FileController {
    constructor(private readonly fileService: FileService) {}

    @MessagePattern(fileBrowse)
    @Authorize('browse', 'file')
    @RpcErrorEncoder()
    browse(@PayloadUserContext() user: UserContextType, @PayloadData() filter: FileBrowseFilter ) {
        return this.fileService.browse(user, filter);
    }

    @MessagePattern(fileCreate)
    @Authorize('create', 'file')
    @RpcErrorEncoder()
    create(@PayloadUserContext() user: UserContextType, @PayloadData() body: FileCreateType) {
        return this.fileService.create(user, body);
    }

    @MessagePattern(fileUpdate)
    @Authorize('update', 'file')
    @RpcErrorEncoder()
    update(@PayloadUserContext() user: UserContextType, @PayloadData() body: FileUpdateType) {
        return this.fileService.update(user, body);
    }

    @MessagePattern(fileDelete)
    @Authorize('delete', 'file')
    @RpcErrorEncoder()
    delete(@PayloadUserContext() user: UserContextType, @PayloadData() filter: FileDeleteFilter) {
        return this.fileService.delete(filter);
    }

}