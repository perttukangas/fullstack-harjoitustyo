import { useVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useRef } from 'react';

import Loading from './Loading';

interface InfiniteScrollProps<T> {
  className: string;
  allRows: T[];
  renderRow: (item: T) => React.ReactNode;
  height: number;
  estimateSize: number;
  overscan?: number;
  fetchNextPage: () => Promise<unknown>;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
}

export default function InfiniteScroll<T>({
  className,
  allRows,
  renderRow,
  height,
  estimateSize,
  overscan,
  fetchNextPage,
  isFetchingNextPage,
  hasNextPage,
}: InfiniteScrollProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? allRows.length + 1 : allRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan: overscan ?? 5,
    measureElement:
      typeof window !== 'undefined' && !navigator.userAgent.includes('Firefox')
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

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
    <>
      <div
        ref={parentRef}
        className={className}
        style={{
          height: `${height}px`,
          width: `100%`,
          overflow: 'auto',
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const isLoaderRow = virtualRow.index > allRows.length - 1;
            const dataRow = allRows[virtualRow.index];

            return (
              <div
                key={virtualRow.index}
                data-index={virtualRow.index}
                ref={(node) => rowVirtualizer.measureElement(node)}
                style={{
                  position: 'absolute',
                  width: '100%',
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {isLoaderRow ? (
                  hasNextPage ? (
                    <Loading />
                  ) : (
                    <p>Nothing more to load</p>
                  )
                ) : (
                  renderRow(dataRow)
                )}
                <p>Size {virtualRow.size}</p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
