import { useVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useRef } from 'react';

import { Error } from '@core/components/Error';
import Loading from '@core/components/Loading';
import { trpc } from '@core/utils/trpc';

export default function Default() {
  const {
    status,
    data,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = trpc.post.infinitePosts.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    }
  );

  const parentRef = useRef<HTMLDivElement>(null);
  const allRows = data ? data.pages.flatMap((d) => d.posts) : [];

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? allRows.length + 1 : allRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5,
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

  if (status === 'pending') {
    return <Loading />;
  }

  if (status === 'error') {
    return <Error error={error} />;
  }

  return (
    <>
      <div
        ref={parentRef}
        className={'infite-scroll-posts'}
        style={{
          height: `${500}px`,
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
                  <>
                    <h2>
                      <a href={`/post/${dataRow.id}`}>{dataRow.title}</a>
                    </h2>
                    <p>{dataRow.content}</p>
                    {dataRow.id % 3 === 0 && (
                      <>
                        {Array.from({ length: 10 }).map((_, index) => (
                          <p key={index}>{dataRow.content}</p>
                        ))}
                      </>
                    )}
                  </>
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
