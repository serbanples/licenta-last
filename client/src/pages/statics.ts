import { Action } from "@/components/types";
import { User } from "@/services/types";
import { LucideIcon } from "lucide-react";

export const getUserCardActions = (messageIcon: LucideIcon, addIcon: LucideIcon, removeIcon: LucideIcon, cancelIcon: LucideIcon): Action[] => {
  return [
    {
      id: "startConversation",
      label: "Message",
      icon: messageIcon,
    },
    {
      id: "addFriend",
      label: "Add Friend",
      icon: addIcon,
      displayRule: (userId: string, viewedUser: User) => {
        return viewedUser.friends.find((friend) => friend.id === userId) === undefined && viewedUser.friendRequests.find((request) => (request.senderId === userId || request.receiverId === userId) && request.status !== 'rejected' && request.status !== 'cancelled' ) === undefined;
      },
      disabled: (userId: string, viewedUser: User) => {
        return viewedUser.friends.find((friend) => friend.id === userId) === undefined && viewedUser.friendRequests.find((request) => (request.senderId === userId || request.receiverId === userId) && request.status !== 'rejected' && request.status !== 'cancelled' ) !== undefined;
      }
    },
    {
      id: "removeFriend",
      label: "Remove Friend",
      icon: removeIcon,
      displayRule: (userId: string, viewedUser: User) => {
        return viewedUser.friends.find((friend) => friend.id === userId) !== undefined;
      },
    },
    {
      id: "cancelFriendRequest",
      label: "Cancel Friend Request",
      icon: cancelIcon,
      displayRule: (userId: string, viewedUser: User) => {
        return viewedUser.friends.find((friend) => friend.id === userId) === undefined && viewedUser.friendRequests.find((request) => (request.senderId === userId || request.receiverId === userId) && request.status === 'pending') !== undefined;
      }
    }
  ];
}