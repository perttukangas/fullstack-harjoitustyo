import { useMemo } from 'react';

import { t } from '@cc/lib/trpc';

import { columns } from './Columns';
import { DataTable } from './DataTable';

export default function Table() {
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

  return <DataTable columns={columns} data={allRows} />;
}
