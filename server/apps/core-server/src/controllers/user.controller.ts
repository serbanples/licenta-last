import { Authorize, LoggerInterceptor, PayloadData, PayloadUserContext, RpcErrorEncoder } from "@app/shared";
import { UserContextType } from "@app/types";
import { Controller, UseInterceptors } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { UserService } from "../modules/user.service";
import { UserBrowseFilter, UserCreateType, UserDeleteType, UserUpdateType } from "@app/types/types/user";
import { UserType } from "@app/dbacc";
import { userAddFile, userBrowse, userCreate, userDelete, userFindById, userSuggest, userUpdate } from "@app/clients";

@UseInterceptors(LoggerInterceptor)
@Controller()
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    @MessagePattern(userBrowse)
    @Authorize('browse', 'users')
    @RpcErrorEncoder()
    browse(@PayloadUserContext() userContext: UserContextType, @PayloadData() filter: UserBrowseFilter) {
        return this.userService.browse(userContext, filter)
    }

    @MessagePattern(userUpdate)
    @Authorize('update', 'users')
    @RpcErrorEncoder()
    update(@PayloadUserContext() userContext: UserContextType, @PayloadData() updateData: UserUpdateType): Promise<UserType> {
        return this.userService.update(updateData);
    }

    // action used by auth service when user deletes account
    @MessagePattern(userDelete)
    @Authorize("delete", "users")
    @RpcErrorEncoder()
    delete(@PayloadUserContext() userContext: UserContextType, @PayloadData() deleteFilter: UserDeleteType): void {
        this.userService.delete(deleteFilter);
    }

    @MessagePattern(userCreate)
    @Authorize('create', 'users')
    @RpcErrorEncoder()
    create(@PayloadUserContext() userContext: UserContextType, @PayloadData() userData: UserCreateType): Promise<UserType> {
        return this.userService.create(userData);
    }

    @MessagePattern(userSuggest)
    @Authorize('suggest', 'users')
    @RpcErrorEncoder()
    suggest(@PayloadUserContext() userContext: UserContextType, @PayloadData() filter: UserBrowseFilter): Promise<string[]> {
        return this.userService.suggest(userContext, filter);
    }

    @MessagePattern(userAddFile)
    @Authorize('addFile', 'users')
    @RpcErrorEncoder()
    addFile(@PayloadUserContext() userContext: UserContextType, @PayloadData() fileId: string) {
        return this.userService.addFileToUser(userContext, fileId);
    }

    //   @MessagePattern(config.rabbitMQ.core.messages.friendRequestRequest)
    //   @Authorize('friendRequest:request')
    //   @RpcErrorEncoder()
    //   sendFriendRequest(@Payload() data: WithContext<string>): Promise<SuccessResponse> {
    //     return this.friendService.sendFriendRequest(data.userContext.id, data.data)
    //   }

    //   @MessagePattern(config.rabbitMQ.core.messages.friendRequestAccept)
    //   @Authorize('friendRequest:accept')
    //   @RpcErrorEncoder()
    //   acceptFriendRequest(@Payload() data: WithContext<string>): Promise<SuccessResponse> {
    //     return this.friendService.acceptFriendRequest(data.data);
    //   }

    //   @MessagePattern(config.rabbitMQ.core.messages.friendRequestReject)
    //   @Authorize('friendRequest:reject')
    //   @RpcErrorEncoder()
    //   rejectFriendRequest(@Payload() data: WithContext<string>): Promise<SuccessResponse> {
    //     return this.friendService.rejectFriendRequest(data.data);
    //   }

    //   @MessagePattern(config.rabbitMQ.core.messages.friendRequestCancel)
    //   @Authorize('friendRequest:cancel')
    //   @RpcErrorEncoder()
    //   cancelFriendRequest(@Payload() data: WithContext<string>): Promise<SuccessResponse> {
    //     return this.friendService.cancelFriendRequest(data.userContext.id, data.data);
    //   }

    //   @MessagePattern(config.rabbitMQ.core.messages.friendRequestBrowse)
    //   @Authorize('friendRequest:browse')
    //   @RpcErrorEncoder()
    //   browseFriendRequest(@Payload() data: WithContext<FriendRequestBrowseFilter>): Promise<ResourceWithPagination<FriendRequestType>> {
    //     return this.friendRequestService.browse(data.userContext, data.data);
    //   }

    //   @MessagePattern(config.rabbitMQ.core.messages.friendRemove)
    //   @Authorize('friend:remove')
    //   @RpcErrorEncoder()
    //   removeFriend(@Payload() data: WithContext<string>): Promise<SuccessResponse> {
    //     return this.friendService.removeFriend(data.userContext.id, data.data);
    //   }

    //   @MessagePattern(config.rabbitMQ.core.messages.friendBrowse)
    //   @Authorize('friend:browse')
    //   @RpcErrorEncoder()
    //   browseFriends(@Payload() data: WithContext<FriendBrowseFilter>): Promise<ResourceWithPagination<UserType>> {
    //     return this.friendService.browse(data.userContext, data.data);
    //   } 

    //   @MessagePattern(config.rabbitMQ.core.messages.friendBrowseCommon)
    //   @Authorize('friend:browseCommon')
    //   @RpcErrorEncoder()
    //   browseCommonFriends(@Payload() data: WithContext<FriendBrowseCommonFilter>): Promise<ResourceWithPagination<UserType>> {
    //     return this.friendService.browseCommon(data.userContext, data.data);
    //   }

}