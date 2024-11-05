import InfiniteScroll from '@c/core/components/InfiniteScroll';
import { t } from '@c/core/utils/trpc';

export default function Default() {
  const infinitePosts = t.post.infinitePosts.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    }
  );

  const { data, status } = infinitePosts;
  const allRows = data ? data.pages.flatMap((d) => d.posts) : [];

  const login = t.user.login.useQuery();
  const register = t.user.register.useQuery();
  const protectedTest = t.user.protectedTest.useQuery();

  console.log(login.data, register.data, protectedTest.data);

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
