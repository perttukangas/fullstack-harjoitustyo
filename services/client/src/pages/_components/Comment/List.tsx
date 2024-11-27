import { lazy, useMemo } from 'react';

import DrawerDialog from '@cc/components/DrawerDialog';
import InfiniteScroll from '@cc/components/InfiniteScroll';
import { useSession } from '@cc/hooks/use-session';
import { type RouterOutputs, t } from '@cc/lib/trpc';

const Create = lazy(() => import('./Create'));
const CommentCard = lazy(() => import('./CommentCard'));

type InfinitePost = RouterOutputs['post']['infinite']['posts'][0];

interface ListProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  post: InfinitePost;
}

export default function List({ open, setOpen, post }: ListProps) {
  const { user } = useSession();
  const infiniteComments = t.post.comment.infinite.useInfiniteQuery(
    { postId: post.id },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    }
  );
  const { data } = infiniteComments;
  const allRows = useMemo(
    () => (data ? data.pages.flatMap((d) => d.comments) : []),
    [data]
  );

  return (
    <DrawerDialog
      title={post.title}
      description={post.content}
      open={open}
      setOpen={setOpen}
      footer={user ? <Create postId={post.id} /> : null}
    >
      <InfiniteScroll
        className="infinite-scroll-comments"
        allRows={allRows}
        renderRow={(row) => <CommentCard postId={post.id} row={row} />}
        estimateSize={200}
        {...infiniteComments}
      />
    </DrawerDialog>
  );
}
