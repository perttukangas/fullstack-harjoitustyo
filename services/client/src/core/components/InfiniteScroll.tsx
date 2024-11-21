import { useVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useRef } from 'react';

import { cn } from '@cc/lib/tailwind';

import Loader from './Loader';

interface InfiniteScrollProps<T> {
  className: string;
  allRows: T[];
  renderRow: (item: T) => React.ReactNode;
  nothingMoreToLoad: React.ReactNode;
  estimateSize: number;
  fetchNextPage: () => Promise<unknown>;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
}

export default function InfiniteScroll<T>({
  className,
  allRows,
  renderRow,
  nothingMoreToLoad,
  estimateSize,
  fetchNextPage,
  isFetchingNextPage,
  hasNextPage,
}: InfiniteScrollProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: hasNextPage ? allRows.length : allRows.length + 1,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    measureElement:
      typeof window !== 'undefined' && !navigator.userAgent.includes('Firefox')
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
  });

  const virtualItems = virtualizer.getVirtualItems();

  useEffect(() => {
    const [lastItem] = [...virtualItems].reverse();

    if (!lastItem) {
      return;
    }

    if (
      lastItem.index >= allRows.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      void fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    allRows.length,
    isFetchingNextPage,
    virtualItems,
  ]);

  return (
    <div
      ref={parentRef}
      className={cn('relative h-full overflow-y-auto', className)}
    >
      <div
        className="relative w-full"
        style={{
          height: `${virtualizer.getTotalSize()}px`,
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const isLoaderRow = virtualRow.index > allRows.length - 1;
          const dataRow = allRows[virtualRow.index];

          return (
            <div
              key={virtualRow.index}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              className="absolute w-full"
              style={{
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {isLoaderRow ? (
                hasNextPage ? (
                  <Loader />
                ) : (
                  nothingMoreToLoad
                )
              ) : (
                renderRow(dataRow)
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
