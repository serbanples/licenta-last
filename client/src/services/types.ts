import { SmallUserType } from "@/data-types/general"

export type LoginFormType = {
  email: string,
  password: string
}

export type SignupFormType = {
  fullName: string,
  email: string,
  password: string,
  confirmPassword: string,
}

export type UserContext = {
  id: string,
  email: string,
  role: UserRoleEnum,
}

enum UserRoleEnum {
  MASTER = 'master',
  ADMIN = 'admin',
  USER = 'user'
}


export type UserState = {
  loggedIn: boolean | null,
  user: UserContext | null
}

export type User = {
  id: string,
  fullName: string,
  email: string,
  description?: string,
  profilePictureUrl?: string,
  role: UserRoleEnum,
  friends: User[],
  friendRequests: FriendRequestType[],
}

export type FriendRequestType = {
  id: string,
  senderId: string,
  receiverId: string,
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled',
}

export type Pagination = { 
  fromItem?: number,
  pageSize?: number,
  orderBy?: string,
  orderDir?: 'asc' | 'desc',
}

export type FileType = {
  id: string,
  name: string,
  description?: string,
  size: number,
  type: string,
  fileURL: string,
  createdAt: Date,
  updatedAt: Date,
  uploadedBy: SmallUserType, 
  mimeType: string
}