import { useMemo } from 'react';

import { type RouterOutputs, t } from '@cc/lib/trpc';

import { columns } from './Columns';

type InfinitePost = RouterOutputs['post']['infinite']['posts'][0]['id'];

interface CommentTableProps {
  postId: InfinitePost;
}

export default function CommentTable({ postId }: CommentTableProps) {
  const infiniteComments = t.post.comment.infinite.useInfiniteQuery(
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

  return <></>;
}
