import InfiniteScroll from '@c/core/components/InfiniteScroll';
import { t } from '@c/core/utils/trpc';

import LoginTest from './LoginTest';
import RegisterTest from './RegisterTest';

export default function Default() {
  const infinitePosts = t.post.infinitePosts.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    }
  );

  const { data, status } = infinitePosts;
  const allRows = data ? data.pages.flatMap((d) => d.posts) : [];

  const protectedA = t.user.protectedTest.useQuery();
  console.log(protectedA.data);

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
      <LoginTest />
      <RegisterTest />
    </>
  );
}
