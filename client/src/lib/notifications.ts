import { getNotifications, updateSeenNotifications } from "@/services/notifications";
import { useEffect, useState } from "react"
import { useSSETopic } from "./sse";

export interface NotificationData {
    id: string,
    sendTo: string[],
    topic: NotificationTopicEnum,
    data: any,
    isSeen: boolean
}

export enum NotificationTopicEnum {
    UPLOAD = 'upload',
    NOTIFICATION = 'notification',
}

export const useNotifications = () => {
    const [notifications, setNotifications] = useState<NotificationData[]>([]);

    const fetchNotifications = () => {
        getNotifications().then((notifs) => {
            setNotifications(filterNotifs(notifs.result));
        })
    }

    const markAsSeen = () => {
        updateSeenNotifications().then(() => {
            setNotifications(filterNotifs(notifications));
        })
    }

    const filterNotifs = (notifications: NotificationData[]) => {
        return notifications.filter((notif) => !notif.isSeen)
    }

    const sseNewValue = useSSETopic<NotificationData>(NotificationTopicEnum.NOTIFICATION);

    useEffect(() => {
        if(sseNewValue) {
            setNotifications(prev => [...prev, sseNewValue]);
        }
    }, [sseNewValue])

    useEffect(() => {
        fetchNotifications();
    }, [])

    const clearNotifications = () => {
        setNotifications([]);
    }

    return {notifications, clearNotifications, markAsSeen};
}