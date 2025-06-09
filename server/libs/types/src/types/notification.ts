export interface NotificationData {
    sendTo: string[],
    topic: NotificationTopicEnum,
    data: any
}

export enum NotificationTopicEnum {
    UPLOAD = 'upload',
    NOTIFICATION = 'notification',
    UPDATE_UNREAD = 'update_unread'
}