import { Link } from '@tanstack/react-router';

import InfiniteScroll from '@c/core/components/InfiniteScroll';
import { t } from '@c/core/utils/trpc';

export default function Index() {
  const infinitePosts = t.post.infinite.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    }
  );

  const { data, status } = infinitePosts;
  const allRows = data ? data.pages.flatMap((d) => d.posts) : [];

  if (status === 'pending') {
    return <p>Loading...</p>;
  }

  if (status === 'error') {
    return <p>Error...</p>;
  }

  return (
    <>
      <InfiniteScroll
        className="infinite-scroll-posts"
        allRows={allRows}
        renderRow={(item) => (
          <>
            <Link to="/posts/$id" params={{ id: item.id.toString() }}>
              {item.title}
            </Link>
            {item.id % 3 === 0 ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={`${item.id}-${index}`}>
                  <p>{item.content}</p>
                  <p>Likes: {item._count.likes}</p>
                </div>
              ))
            ) : (
              <>
                <p>{item.content}</p>
                <p>Likes: {item._count.likes}</p>
              </>
            )}
          </>
        )}
        height={500}
        estimateSize={100}
        {...infinitePosts}
      />
    </>
  );
}
