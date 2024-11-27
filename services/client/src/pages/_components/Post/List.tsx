import { lazy, useMemo } from 'react';

import InfiniteScrollWindow from '@cc/components/InfiniteScrollWindow';
import { t } from '@cc/lib/trpc';

const PostCard = lazy(() => import('./PostCard'));

export default function List() {
  const infinitePosts = t.post.infinite.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    }
  );
  const { data } = infinitePosts;
  const allRows = useMemo(
    () => (data ? data.pages.flatMap((d) => d.posts) : []),
    [data]
  );

  return (
    <InfiniteScrollWindow
      className="infinite-scroll-posts"
      allRows={allRows}
      renderRow={(row) => <PostCard row={row} />}
      estimateSize={200}
      {...infinitePosts}
    />
  );
}
