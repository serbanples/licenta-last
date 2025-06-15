import { FileModel, UserModel, UserType } from "@app/dbacc";
import { FileTypeEnum, ResourceWithPagination, UserContextType } from "@app/types";
import { UserBrowseFilter, UserCreateType, UserDeleteType, UserUpdateType } from "@app/types/types/user";
import { Injectable, NotFoundException } from "@nestjs/common";
import * as _ from "lodash";
import { DeleteResult } from "mongoose";

@Injectable()
export class UserService {
    constructor(
        private readonly userModel: UserModel,
        private readonly fileModel: FileModel,
    ) { }

    browse(usercontext: UserContextType, filter: UserBrowseFilter): Promise<ResourceWithPagination<UserType>> {
        const pagination = filter.pagination || {};
        let formattedFilter: any = { ...filter };
        if (!filter._id) {
            formattedFilter = { ...filter, _id: { '$nin': [usercontext.id] } }
        }

        return this.userModel.findWithPagination(pagination, formattedFilter, true)
    }

    create(newDocument: UserCreateType): Promise<UserType> {
        return this.userModel.create(newDocument)
    }

    update(updatedDocument: UserUpdateType): Promise<UserType> {
        const updateBody = { ...updatedDocument.updateBody };
        return this.userModel.updateOne({ _id: updatedDocument.id }, updateBody)
            .then((updatedUser) => {
                if (_.isNil(updatedUser)) {
                    throw new NotFoundException('User not found');
                }

                return updatedUser;
            })
    }

    delete(deletedDocument: UserDeleteType): Promise<DeleteResult> {
        return this.userModel.deleteOne({ _id: deletedDocument.id })
    }

    suggest(context: UserContextType, filter: UserBrowseFilter): Promise<string[]> {
        const pagination = filter.pagination || { fromItem: 0, pageSize: 5 };
        const formattedFilter = { ...filter, _id: { '$nin': [context.id] } }
        return this.userModel.findWithPagination(pagination, formattedFilter, filter.populate)
            .then((result) => {
                const names = result.result.map((user) => user.fullName);
                return names;
            })
    }

    getUserFriends(userId: string): Promise<string[]> {
        return this.userModel.findOne({ _id: userId })
            .then(async (user) => {
                if (!user) throw new NotFoundException('User not found');
                return user.friends;
            })
    }

    async addFileToUser(userContext: UserContextType, fileId: string): Promise<UserType> {
        const isProfilePicture = await this.checkIfFileIsProfilePicture(fileId);
        return this.userModel.updateOne({ _id: userContext.id }, { $addToSet: { files: fileId } })
            .then(async (updatedUser) => {
                if (_.isNil(updatedUser)) {
                    throw new NotFoundException('User not found');
                }
                if (isProfilePicture) {
                    await this.userModel.updateOne({ _id: userContext.id }, { profilePictureUrl: isProfilePicture });
                }
                return updatedUser;
            });
    }

    private checkIfFileIsProfilePicture(fileId: string) {
        return this.fileModel.findOne({ _id: fileId })
            .then((file) => {
                if (!file) {
                    throw new NotFoundException('File not found');
                }
                if (file.fileType === FileTypeEnum.PROFILE) {
                    return file.fileURL;
                };
                return undefined;
            })
    }
}