import { useRef, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import { getData } from '../utils/fetch-util';

interface InfiniteScrollProps<T> {
  baseUrl: string;
  estimatedElementSize: number;
  dynamicElementSize: boolean;
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
  page: T[];
  nextCursor: number;
}

export default function InfiniteScroll<T>({
  baseUrl,
  estimatedElementSize,
  dynamicElementSize,
  height,
  renderItem,
  overscan = 5,
  className = undefined,
  pendingItem = <p>Loading...</p>,
  errorItem = (error) => <p>Error: {error.message}</p>,
  loadingMoreItem = <p>Loading more...</p>,
  nothingMoreItem = <p>Nothing more to load</p>,
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
      const jsonResponse = await getData(`${baseUrl}?cursor=${pageParam}`);
      return jsonResponse.data as InfiniteScrollGetResponse<T>;
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
    measureElement:
      dynamicElementSize &&
      typeof window !== 'undefined' &&
      !navigator.userAgent.includes('Firefox')
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
                  width: '100%',
                  transform: `translateY(${virtualRow.start}px)`,
                  ...(!dynamicElementSize && {
                    height: `${virtualRow.size}px`,
                  }),
                }}
                {...(dynamicElementSize && {
                  'data-index': virtualRow.index,
                  ref: (node) => rowVirtualizer.measureElement(node),
                })}
              >
                {isLoaderRow
                  ? hasNextPage
                    ? loadingMoreItem
                    : nothingMoreItem
                  : renderItem(dataRow)}
                <p>Size {virtualRow.size}</p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
