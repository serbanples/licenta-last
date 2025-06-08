import { UserModel, UserType } from "@app/dbacc";
import { with_pagination, with_populate, with_text } from "./db";

export interface UserBrowseFilter extends with_pagination, with_text, with_populate {
    _id?: string;
    accountId?: string;
}

export interface UserCreateType {
    email: string;
    fullName: string;
    accountId: string;
}

export interface UserUpdateType {
    id: string;
    updateBody: Partial<UserType>
}

export interface UserDeleteType {
    id: string;
}

export interface FriendBrowseFilter extends with_pagination {
}

export interface FriendBrowseCommonFilter extends with_pagination {
    userId: string;
}

export enum FriendRequestStatusEnum {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
    CANCELLED = 'cancelled',
}