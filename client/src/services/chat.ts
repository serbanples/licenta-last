import { POST } from "./requestHandler";
import { Pagination } from "./types";
import { CONVERSATIONS_BROWSE, CONVERSATIONS_CREATE, MESSAGES_BROWSE } from "./urls";

export const getConversations = (filter: { pagination: Pagination, text?: string, _id?: string }) => {
    return POST(CONVERSATIONS_BROWSE, filter)
}

export const createConversation = (participants: string[], name?: string, description?: string) => {
    return POST(CONVERSATIONS_CREATE, { participants, name, description })
}

export const getMessages = (conversationId: string, pagination: Pagination) => {
    return POST(MESSAGES_BROWSE, { conversationId, pagination });
}