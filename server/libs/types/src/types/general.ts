import { UserRoleEnum } from "./db";

export interface UserContextType {
    id: string;
    email: string;
    role: UserRoleEnum;
}

export interface RequestWrapper extends Request {
    user?: UserContextType
}


export type SuccessResponse = {
    success: boolean;
}

export type Token = {
  accessToken: string;
}

export type WithContext<T> = {
    userContext: UserContextType;
    data: T
}