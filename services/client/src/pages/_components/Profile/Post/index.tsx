import { useMemo } from 'react';

import { t } from '@cc/lib/trpc';

import CommentTable from '../Comment';
import { DataTable } from '../DataTable';
import columns from './Columns';

export default function Table() {
  const infinitePosts = t.post.infiniteCreator.useInfiniteQuery(
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
    <DataTable
      columns={columns()}
      data={allRows}
      expandedRender={(data) => (
        <>
          <p>{data.content}</p>
          <CommentTable post={data} />
        </>
      )}
    />
  );
}
