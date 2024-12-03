import { useMemo } from 'react';

import { type RouterOutputs, t } from '@cc/lib/trpc';

import { DataTable } from '../DataTable';
import columns from './Columns';

type InfinitePost = RouterOutputs['post']['infiniteCreator']['posts'][0];

interface IndexProps {
  post: InfinitePost;
}

export default function Index({ post }: IndexProps) {
  const infiniteComments = t.post.comment.infiniteCreator.useInfiniteQuery(
    { postId: post.id },
    {
      getPreviousPageParam: (onePage) => onePage.previousCursor ?? undefined,
      getNextPageParam: (onePage) => onePage.nextCursor ?? undefined,
      maxPages: 1,
    }
  );
  const { data } = infiniteComments;
  const allRows = useMemo(
    () => (data ? data.pages.flatMap((d) => d.comments) : []),
    [data]
  );

  return (
    <DataTable
      columns={columns({ postId: post.id })}
      columnsData={allRows}
      {...infiniteComments}
    />
  );
}
