import React, { useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useChatContext } from "../chat-page-context";
import { ChatInput } from "./chat-input";
import { ChatViewHeader } from "./chat-view-header";
import { LoadingOverlay } from "@/components/ui/laoding-overlay";
import { MessageBox } from "./message-box";
// import { MessageBox } from "./message-box"; // your component to render a single msg

export const ChatView: React.FC = () => {
  const {
    messages,
    fetchNext,
    hasMore,
    conversationId
  } = useChatContext().chatViewContext;

  // a ref to the scrollable div so we can reset scroll on conv change
  const scrollableRef = useRef<HTMLDivElement>(null);

  // whenever the user switches convo or messages reset, scroll to bottom
  useEffect(() => {
    const el = scrollableRef.current;
    if (el) {
      // because of flex-col-reverse, scrollTop=0 is the bottom
      el.scrollTop = 0;
    }
  }, [conversationId]);

  return (
    <div className="flex flex-col flex-1 h-full">
      <ChatViewHeader />

      <div
        id="chat-scrollable"
        ref={scrollableRef}
        className="flex-1 overflow-y-auto p-4 flex flex-col-reverse"
      >
        <InfiniteScroll
          dataLength={messages.length}
          next={fetchNext}
          hasMore={hasMore}
          loader={<LoadingOverlay/>}
          inverse={true}                     // listen for “scroll to top”
          scrollableTarget="chat-scrollable" // must match the container’s id
          style={{ display: "flex", flexDirection: "column-reverse" }}
        >
          {messages.map((msg) => (
            <MessageBox key={msg.id} message={msg} />
            // <div>{msg.text}</div>
          ))}
        </InfiniteScroll>
      </div>

      <ChatInput />
    </div>
  );
};
