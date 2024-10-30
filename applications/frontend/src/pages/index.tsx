import React, { useCallback, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

export default function Home() {
  const lastObserver = useRef<IntersectionObserver>();
  const firstObserver = useRef<IntersectionObserver>();

  const {
    status,
    data,
    error,
    isLoading,
    isFetching,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
  } = useInfiniteQuery({
    queryKey: ['projects'],
    queryFn: async ({ pageParam }) => {
      const response = await fetch(`/api?cursor=${pageParam}`);
      return await response.json();
    },
    initialPageParam: 0,
    getPreviousPageParam: (firstPage) => firstPage.previousId ?? undefined,
    getNextPageParam: (lastPage) => lastPage.nextId ?? undefined,
    maxPages: 3,
  });

  const firstElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;

      if (firstObserver.current) firstObserver.current.disconnect();

      firstObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasPreviousPage && !isFetching) {
          fetchPreviousPage();
        }
      });

      if (node) firstObserver.current.observe(node);
    },
    [fetchPreviousPage, hasPreviousPage, isFetching, isLoading]
  );

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;

      if (lastObserver.current) lastObserver.current.disconnect();

      lastObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetching) {
          fetchNextPage();
        }
      });

      if (node) lastObserver.current.observe(node);
    },
    [fetchNextPage, hasNextPage, isFetching, isLoading]
  );

  return (
    <div>
      <h1>Infinite Query with max pages</h1>
      <h3>4 projects per page</h3>
      <h3>3 pages max</h3>
      {status === 'pending' ? (
        <p>Loading...</p>
      ) : status === 'error' ? (
        <span>Error: {error.message}</span>
      ) : (
        <>
          {data.pages.map((page, pageIndex) => (
            <React.Fragment key={page.nextId}>
              {page.data.map((project, projectIndex) => {
                const isFirst = pageIndex === 0 && projectIndex === 0;
                const isLast =
                  pageIndex === data.pages.length - 1 &&
                  projectIndex === page.data.length - 1;
                return (
                  <p
                    style={{
                      border: '1px solid gray',
                      borderRadius: '5px',
                      padding: '8px',
                      fontSize: '14px',
                      background: `hsla(${project.id * 30}, 60%, 80%, 1)`,
                    }}
                    key={project.id}
                    ref={
                      isFirst ? firstElementRef : isLast ? lastElementRef : null
                    }
                  >
                    {project.name}
                  </p>
                );
              })}
            </React.Fragment>
          ))}
        </>
      )}
    </div>
  );
}
