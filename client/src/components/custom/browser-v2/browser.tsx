import React, { JSX } from 'react';
import { ApiResponse } from '@/data-types/general';
import InfiniteScroll from 'react-infinite-scroll-component';

export interface BrowserProps<T> {
  pages: ApiResponse<T>[];
  loadMore: () => void;
  hasMore: boolean;
  isLoading?: boolean;
  isError?: boolean;
  error?: Error;
  renderItem: (item: T) => React.ReactNode;
  columns?: number;
}

export default function Browser<T>({
  pages,
  loadMore,
  hasMore,
  isLoading = false,
  isError = false,
  error,
  renderItem,
  columns = 3,
}: BrowserProps<T>): JSX.Element {
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error?.message ?? 'An error occurred'}</p>;

  // Flatten all fetched items
  const items = pages.flatMap((page) => page.result);

  return (
    <InfiniteScroll
      dataLength={items.length}
      next={loadMore}
      hasMore={hasMore}
      loader={<p>Loading more...</p>}
    >
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {items.map((item, index) => (
          <React.Fragment key={(item as any).id ?? index}>
            {renderItem(item)}
          </React.Fragment>
        ))}
      </div>
    </InfiniteScroll>
  );
}
