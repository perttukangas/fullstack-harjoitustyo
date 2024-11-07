import { useMatch } from '@tanstack/react-router';

import InfiniteScroll from '@c/core/components/InfiniteScroll';
import { t } from '@c/core/utils/trpc';

export default function Id() {
  const { params } = useMatch({ from: '/posts/$id' });
  const infinitePostComments = t.post.comment.infiniteComments.useInfiniteQuery(
    { postId: Number(params.id) },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    }
  );

  const { data, status } = infinitePostComments;
  const allRows = data ? data.pages.flatMap((d) => d.comments) : [];

  if (status === 'pending') {
    return <p>Loading...</p>;
  }

  if (status === 'error') {
    return <p>Error...</p>;
  }

  return (
    <>
      <InfiniteScroll
        className="infinite-scroll-post-comments"
        allRows={allRows}
        renderRow={(item) => (
          <>
            <p>{item.content}</p>
          </>
        )}
        height={500}
        estimateSize={100}
        {...infinitePostComments}
      />
    </>
  );
}
