import { useRef, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';

interface InfiniteScrollProps<T> {
  baseUrl: string;
  estimatedElementSize: number;
  height: number;
  renderItem: (item: T) => React.ReactNode;
  overscan?: number;
  className?: string;
  pendingItem?: React.ReactNode;
  errorItem?: (error: Error) => React.ReactNode;
  loadingMoreItem?: React.ReactNode;
  nothingMoreItem?: React.ReactNode;
}

interface InfiniteScrollGetResponse<T> {
  data: {
    page: T[];
    nextCursor: number;
  };
}

export default function InfiniteScroll<T>({
  baseUrl,
  estimatedElementSize,
  height,
  renderItem,
  overscan = 5,
  className = undefined,
  pendingItem = <p>Loading...</p>,
  errorItem = (error) => <p>Error: {error.message}</p>,
  loadingMoreItem = <p>Loading more...</p>,
  nothingMoreItem = <p>Noting more to load</p>,
}: InfiniteScrollProps<T>) {
  const {
    status,
    data,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: [`infinite-scroll`, baseUrl],
    queryFn: async ({ pageParam }) => {
      const response = await fetch(`${baseUrl}?cursor=${pageParam}`);
      const responseJson =
        (await response.json()) as InfiniteScrollGetResponse<T>;

      return responseJson.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  const parentRef = useRef<HTMLDivElement>(null);
  const allRows = data ? data.pages.flatMap((d) => d.page) : [];

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? allRows.length + 1 : allRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimatedElementSize,
    overscan,
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

  if (status === 'pending') {
    return pendingItem;
  }

  if (status === 'error') {
    return errorItem(error);
  }

  const computedClassName =
    className ?? `infinite-scroll-${baseUrl.replace(/\//g, '-')}`;

  return (
    <>
      <div
        ref={parentRef}
        className={computedClassName}
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
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {isLoaderRow
                  ? hasNextPage
                    ? loadingMoreItem
                    : nothingMoreItem
                  : renderItem(dataRow)}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
