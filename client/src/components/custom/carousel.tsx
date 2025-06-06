// components/InfiniteCarousel.tsx
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";

interface InfiniteCarouselProps<T> {
  items: T[];
  hasMore: boolean;
  loadMore: () => void;
  /**
   * Render a single “card” for one item.
   * (You can render a <UserCard> or <FileCard> here.)
   */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Optional fixed width for each card (px). Defaults to 200. */
  itemWidthPx?: number;
  className?: string;
}

export function InfiniteCarousel<T>({
  items,
  hasMore,
  loadMore,
  renderItem,
  itemWidthPx = 200,
  className = "",
}: InfiniteCarouselProps<T>) {
  // Generate a stable ID for the scrollable container
  const containerId = React.useId();

  return (
    <div
      id={containerId}
      className={`flex overflow-x-auto no-scrollbar ${className}`}
      style={{ padding: "1rem 0" }}
    >
      <InfiniteScroll
        dataLength={items.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<div className="px-4">Loading…</div>}
        // Tell the library to listen on our horizontal container
        scrollableTarget={containerId}
        // Render children in a flex row
        style={{ display: "flex" }}
      >
        {items.map((item, idx) => (
          <div
            key={idx}
            style={{ flex: "0 0 auto", width: itemWidthPx, marginRight: 16 }}
          >
            {renderItem(item, idx)}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
}
