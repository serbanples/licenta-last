import { MessageType } from "@app/dbacc";
import { with_pagination, with_populate, with_text } from "./db";

export interface MessageBrowseFilter extends with_pagination, with_text, with_populate {
    _id?: string;
    conversationId: string;
}

export interface MessageCreateType {
    text: string;
    conversationId: string;
}

export interface MessageUpdateType {
    id: string;
    updateBody: Partial<MessageType>
}

export interface MessageDeleteFilter {
    id: string;
}