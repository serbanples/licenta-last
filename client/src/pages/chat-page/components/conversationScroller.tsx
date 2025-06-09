import InfiniteScroll from "react-infinite-scroll-component";
import { useChatContext } from "../chat-page-context";
import { ConversationCard } from "./conversation-card";
import { NewConversationDialog } from "./new-conv-dialog";
import { NewDirectConversationDialog } from "./new-direct-conversation";

export const ConversationScroller = () => {
    const { conversations, fetchNext, hasMore, onConversationSelect } = useChatContext().conversationScrollerContext
  return (
    <div id="conversation-scroller" className="w-1/4 h-full flex flex-col border-r">
      {/* Top bar with create button aligned right */}
      <div className="flex items-center justify-between p-2">
        <h3 className="text-lg font-semibold">Conversations</h3>
        <div className="flex">
          <NewDirectConversationDialog />
          <NewConversationDialog />
        </div>
      </div>
      <div id="conversation-list" className="flex-1 overflow-auto p-2">
        <InfiniteScroll
          dataLength={conversations.length}
          next={fetchNext}
          hasMore={hasMore}
          loader={<p className="text-center py-2">Loading...</p>}
          scrollableTarget="conversation-list"
        >
          {conversations.map(conv => (
            <ConversationCard
              key={conv.id}
              conversation={conv}
              onClick={() => onConversationSelect(conv.id)}
            />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
}