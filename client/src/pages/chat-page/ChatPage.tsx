// import { NewConversationDialog } from "@/components/custom/chat/newConvDialog";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import React, { useEffect } from "react";
import { ChatProvider } from "./chat-page-context";
import { ConversationScroller } from "./components/conversationScroller";
import { ChatView } from "./components/chat-view";

export const ChatPage: React.FC = () => {
  const { reset } = useBreadcrumbs();

  useEffect(() => {
    reset([]);
  }, [])

  return (
    <ChatProvider>
      <div className="flex h-full">
        <ConversationScroller />
        <ChatView /> 
      </div>
    </ChatProvider>
  )
}