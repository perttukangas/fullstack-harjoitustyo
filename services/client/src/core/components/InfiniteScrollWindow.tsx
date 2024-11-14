import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useRef } from 'react';

import Loader from './Loader';

interface InfiniteScrollWindowProps<T> {
  className: string;
  allRows: T[];
  renderRow: (row: T) => React.ReactNode;
  nothingMoreToLoad: React.ReactNode;
  estimateSize: number;
  fetchNextPage: () => Promise<unknown>;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
}

export default function InfiniteScrollWindow<T>({
  className,
  allRows,
  renderRow,
  nothingMoreToLoad,
  estimateSize,
  fetchNextPage,
  isFetchingNextPage,
  hasNextPage,
}: InfiniteScrollWindowProps<T>) {
  const listRef = useRef<HTMLDivElement>(null);

  const virtualizer = useWindowVirtualizer({
    count: hasNextPage ? allRows.length : allRows.length + 1,
    scrollMargin: listRef.current?.offsetTop ?? 0,
    estimateSize: () => estimateSize,
    overscan: 5,
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
    <div ref={listRef} className={className}>
      <div
        className="relative w-full"
        style={{
          height: `${virtualizer.getTotalSize()}px`,
        }}
      >
        {virtualizer.getVirtualItems().map((row) => {
          const isLoaderRow = row.index > allRows.length - 1;
          const dataRow = allRows[row.index];

          return (
            <div
              key={row.key}
              data-index={row.index}
              ref={virtualizer.measureElement}
              className="absolute w-full"
              style={{
                transform: `translateY(${
                  row.start - virtualizer.options.scrollMargin
                }px)`,
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
