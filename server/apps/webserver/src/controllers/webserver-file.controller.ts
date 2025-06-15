import { UploaderClient } from "@app/clients";
import { CoreProxyService } from "@app/clients/coreProxy.service";
import { UserContext } from "@app/shared";
import { FileTypeEnum, FileUploadJobData, UserContextType } from "@app/types";
import { FileBrowseFilter, FileDeleteFilter, FileUpdateType } from "@app/types/types/files";
import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Post, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import * as fileConfig from 'libs/shared/src/constants/file.constants';

@Controller('files')
export class WebserverFileController {
    constructor(private readonly uploaderQueue: UploaderClient, private readonly coreProxy: CoreProxyService) { }

    @Post('upload/profile-photo')
    @UseInterceptors(
        FileInterceptor('file', {
            limits: {
                fileSize: fileConfig.limit
            },
            fileFilter: (_, file, cb) => {
                console.log(file)
                if (!fileConfig.fileTypes.PHOTO.includes(file.mimetype)) {
                    return cb(new BadRequestException('Only image files are allowed'), false);
                }
                cb(null, true);
            },
        })
    )
    uploadProfilePhoto(@UserContext() usercontext: UserContextType, @UploadedFile() file: Express.Multer.File, @Body() body: any) {
        const mapped = this.mapFile(usercontext, file, 'profile-photo', body.metadata);
        this.uploaderQueue.send(mapped);
        return { message: 'Profile photo uploaded successfully' };
    }

    @Post('upload/file')
    @UseInterceptors(
        FileInterceptor('file', {
            limits: {
                fileSize: fileConfig.limit
            },
            fileFilter: (_, file, cb) => {
                if (!fileConfig.fileTypes.FILE.includes(file.mimetype) && !fileConfig.fileTypes.PHOTO.includes(file.mimetype)) {
                    return cb(new BadRequestException('Only pdfs and images files are allowed'), false);
                }
                cb(null, true);
            },
        })
    )
    uploadFile(@UserContext() usercontext: UserContextType, @UploadedFile() file: Express.Multer.File, @Body() body: any) {
        const mapped = this.mapFile(usercontext, file, 'file', body.metadata);
        this.uploaderQueue.send(mapped)
        return { message: 'File uploaded successfully' };
    }

    @Post('browse')
    @HttpCode(HttpStatus.OK)
    browseFiles(@UserContext() user: UserContextType, @Body() filter: FileBrowseFilter) {
        return this.coreProxy.browseFiles({ userContext: user, data: filter });
    }

    @Post('update')
    @HttpCode(HttpStatus.OK)
    updateFiles(@UserContext() user: UserContextType, @Body() body: FileUpdateType) {
        return this.coreProxy.updateFile({ userContext: user, data: body });
    }

    @Post('delete')
    @HttpCode(HttpStatus.OK)
    deleteConversation(@UserContext() user: UserContextType, @Body() data: FileDeleteFilter) {
        return this.coreProxy.deleteFile({ userContext: user, data: data });
    }

    private mapFile(usercontext: UserContextType, file: Express.Multer.File, fileType: 'file' | 'profile-photo', metadata?: any): FileUploadJobData {
        return {
            file: file,
            fileType: fileType === 'file' && fileConfig.fileTypes.PHOTO.includes(file.mimetype) ? FileTypeEnum.PICTURE : fileType === 'file' && fileConfig.fileTypes.FILE.includes(file.mimetype) ? FileTypeEnum.DOCUMENT : FileTypeEnum.PROFILE,
            userContext: usercontext,
            metadata: metadata
        }
    }


}