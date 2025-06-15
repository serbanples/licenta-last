import { ConversationType } from "@app/dbacc";
import { with_pagination, with_populate, with_text } from "./db";

export interface ConversationBrowseFilter extends with_pagination, with_text, with_populate {
    _id?: string;
    participants?: string[]
}

export interface ConversationCreateType {
    name?: string;
    description?: string;
    participants: string[];
}

export interface ConversationUpdateType {
    id: string;
    updateBody: Partial<ConversationType>
}

export interface ConversationDeleteFilter {
    id: string;
}

export interface ConversationAddUser {
    conversationId: string,
    userId: string
}