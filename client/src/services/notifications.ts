import { GET } from "./requestHandler"
import { NOTIFICATIONS_BROWSE, NOTIFICATIONS_UPDATE_SEEN } from "./urls"

export const getNotifications = () => {
    return GET(NOTIFICATIONS_BROWSE)
}

export const updateSeenNotifications = () => {
    return GET(NOTIFICATIONS_UPDATE_SEEN)
}