import Error from '@core/components/Error';
import InfiniteScroll from '@core/components/InfiniteScroll';
import Loading from '@core/components/Loading';
import { trpc } from '@core/utils/trpc';

export default function Default() {
  const infinitePosts = trpc.post.infinitePosts.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    }
  );

  const { data, status, error } = infinitePosts;
  const allRows = data ? data.pages.flatMap((d) => d.posts) : [];

  if (status === 'pending') {
    return <Loading />;
  }

  if (status === 'error') {
    return <Error error={error} />;
  }

  return (
    <>
      <InfiniteScroll
        className="infinite-scroll-posts"
        allRows={allRows}
        renderRow={(item) => (
          <>
            <h1>{item.title}</h1>
            {item.id % 3 === 0 ? (
              Array.from({ length: 10 }).map((_, index) => (
                <p key={index}>{item.content}</p>
              ))
            ) : (
              <p>{item.content}</p>
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
