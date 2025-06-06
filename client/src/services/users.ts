import { ApiResponse, Suggestion } from "@/data-types/general";
import { GET, mapToQueryParams, POST } from "./requestHandler";
import { USER_BROWSE_URL, USER_FRIENDS_COMMON_URL, USER_FRIENDS_MINE_URL, USER_REMOVE_FRIEND_URL, USER_REQUEST_ADD_FRIEND_URL, USER_REQUEST_CANCEL_FRIEND_URL, USER_SUGGEST_URL, USER_UPDATE_URL } from "./urls";
import { Pagination, User } from "./types";

export const suggest = async(filter: Record<string, string>): Promise<Suggestion[]> => {
  const route = mapToQueryParams(USER_SUGGEST_URL, filter);
  return GET(route)
    .then((data: string[]) => data.map((item, index) => ({ id: index, label: item })))
}

export const browse = async(filter: Record<string, any>): Promise<ApiResponse<User>> => {
  return POST(USER_BROWSE_URL, {...filter, populate: true})
} 

export const findById = async(id: string): Promise<User> => {
  return POST(USER_BROWSE_URL, { _id: id })
    .then((users: ApiResponse<User>) => {
      if(users.result.length === 0) {
        throw new Error();
      }
      return users.result[0];
    }) 
}

export const update = async (updateBody: User) => {
  return POST(USER_UPDATE_URL, { id: updateBody.id, updateBody });
}

export const browseFriends = async (pagination: Pagination, type: 'mine' | 'common', pairId?: string,): Promise<ApiResponse<User>> => {
  if(type === 'mine') {
    return POST(USER_FRIENDS_MINE_URL, { pagination});
  } else return POST(USER_FRIENDS_COMMON_URL, { pagination, userId: pairId });
}

export const requestAddFriend = async (friendId: string) => {
  return POST(USER_REQUEST_ADD_FRIEND_URL, { friendId });
}

export const cancelAddFriend = async (friendId: string) => {
  return POST(USER_REQUEST_CANCEL_FRIEND_URL, { friendId });
}

export const removeFriend = async (friendId: string) => {
  return POST(USER_REMOVE_FRIEND_URL, { friendId });
}