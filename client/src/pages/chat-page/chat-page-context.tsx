import { createContext, ReactNode, useContext } from "react"
import { useConversationScroller } from "./hooks/useConversationScroller";
import { useNewConvModal } from "./hooks/new-conv-modal";
import { User } from "@/services/types";
import { ConversationType, MessageType } from "@/data-types/general";
import { useChatView } from "./hooks/useChatView";

type ChatContextType = {
    conversationScrollerContext: {
        conversations: ConversationType[];
        fetchNext: () => void;
        fetchById: (id: string) => void;
        clear: () => void;
        hasMore: boolean;
        onConversationSelect: (id: string) => void;
        reload: () => void,
        updateUnread: (conversationId: string) => void;
    },
    newConvDialogContext: {
        onCreate: (users: User[], name?: string, description?: string) => void;
        onSearchUsers: (text: string) => void;
        users: User[];
    },
    chatViewContext: {
        messages: MessageType[];
        hasMore: boolean;
        messageLoading: boolean;
        fetchNext: () => void;
        conversationId: string | null;
        conversationData: ConversationType | undefined;
        onSend: (text: string) => void
    }
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
    const conversationScrollerContext = useConversationScroller();
    const newConvDialogContext = useNewConvModal();
    const chatViewContext = useChatView();

    return (
        <ChatContext.Provider value={{ conversationScrollerContext, newConvDialogContext, chatViewContext }}>
            {children}
        </ChatContext.Provider>
    )
}

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useLoading must be used within LoadingProvider")
    }
    return context
}
