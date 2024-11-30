import { useMemo } from 'react';

import { type RouterOutputs, t } from '@cc/lib/trpc';

import { DataTable } from '../DataTable';
import { columns } from './Columns';

type InfinitePost = RouterOutputs['post']['infiniteCreator']['posts'][0]['id'];

interface IndexProps {
  postId: InfinitePost;
}

export default function Index({ postId }: IndexProps) {
  const infiniteComments = t.post.comment.infiniteCreator.useInfiniteQuery(
    { postId },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    }
  );
  const { data } = infiniteComments;
  const allRows = useMemo(
    () => (data ? data.pages.flatMap((d) => d.comments) : []),
    [data]
  );

  return <DataTable columns={columns} data={allRows} />;
}
