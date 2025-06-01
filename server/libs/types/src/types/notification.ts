export interface NotificationData {
    sendTo: string[],
    topic: NotificationTopicEnum,
    data: any
}

export enum NotificationTopicEnum {
    UPLOAD = 'upload',
    FRIEND_REQUEST = 'friend-request',
}