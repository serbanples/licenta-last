import { CoreProxyService } from "@app/clients/coreProxy.service";
import { UserType } from "@app/dbacc";
import { UserContext } from "@app/shared";
import { ResourceWithPagination, UserContextType } from "@app/types";
import { UserBrowseFilter, UserUpdateType } from "@app/types/types/user";
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Req, UseGuards } from "@nestjs/common";
import { Observable } from "rxjs";

@Controller('users')
export class WebserverUserController {
    constructor(
        private readonly coreProxy: CoreProxyService
    ) {}

    /**
   * Method used to handle register requests.
   * 
   * @param {NewAccountDto} registerData registration form.
   * @returns {Observable<SuccessResponse>} register response.
   */
  @Post('browse')
  @HttpCode(HttpStatus.OK)
  browse(@UserContext() user: UserContextType, @Body() browseFilter: UserBrowseFilter): Observable<ResourceWithPagination<UserType>> {
    return this.coreProxy.browseUsers({userContext: user, data: browseFilter});
  }

  @Get('/:id')
  findById(@UserContext() user: UserContextType, @Query() id: string) {
    return this.coreProxy.findByIdUser({ userContext: user, data: id })
  }

  @Post('update')
  @HttpCode(HttpStatus.OK)
  update(@UserContext() user: UserContextType, @Body() updateData: UserUpdateType): Observable<UserType> {
    return this.coreProxy.updateUser({ userContext: user, data: updateData });
  }

  @Get('suggest')
  @HttpCode(HttpStatus.OK)
  suggest(@UserContext() user: UserContextType, @Query() queryParams): Observable<string[]> {
    return this.coreProxy.suggestUser({ userContext: user, data: queryParams });
  }

//   @Post('request-add-friend')
//   @HttpCode(HttpStatus.OK)
//   requestAddFriend(@Req() req: RequestWrapper): Observable<SuccessResponse> {
//     return this.service.requestAddFriend(req.user!, req.body.friendId);
//   }

//   @Post('accept-friend-request')
//   @HttpCode(HttpStatus.OK)
//   acceptFriendRequest(@Req() req: RequestWrapper): Observable<SuccessResponse> {
//     return this.service.acceptFriendRequest(req.user!, req.body.requestId);
//   }

//   @Post('reject-friend-request')
//   @HttpCode(HttpStatus.OK)
//   rejectFriendRequest(@Req() req: RequestWrapper): Observable<SuccessResponse> {
//     return this.service.rejectFriendRequest(req.user!, req.body.requestId)
//   }

//   @Post('cancel-friend-request')
//   @HttpCode(HttpStatus.OK)
//   cancelFriendRequest(@Req() req: RequestWrapper): Observable<SuccessResponse> {
//     return this.service.cancelFriendRequest(req.user!, req.body.friendId)
//   }

//   @Post('remove-friend')
//   @HttpCode(HttpStatus.OK)
//   removeFriend(@Req() req: RequestWrapper): Observable<SuccessResponse> {
//     return this.service.removeFriend(req.user!, req.body.friendId);
//   }

//   @Post('browse-friends')
//   @HttpCode(HttpStatus.OK)
//   browseFriends(@Req() req: RequestWrapper, @Body() browseFilter: FriendBrowseFilter): Observable<ResourceWithPagination<UserType>> {
//     return this.service.browseFriends(req.user!, browseFilter);
//   }
//   @Post('browse-common-friends')
//   @HttpCode(HttpStatus.OK)
//   browseCommonFriends(@Req() req: RequestWrapper, @Body() browseFilter: FriendBrowseCommonFilter): Observable<ResourceWithPagination<UserType>> {
//     return this.service.browseCommonFriends(req.user!, browseFilter);
//   }
}