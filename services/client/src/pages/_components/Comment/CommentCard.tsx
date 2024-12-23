import { Pencil, Trash } from 'lucide-react';
import { lazy } from 'react';

import { Card, CardContent, CardFooter } from '@cc/components/Card';
import LazyButton from '@cc/components/LazyButton';
import { lazyPrefetch } from '@cc/lib/lazy-prefetch';
import { type RouterOutputs } from '@cc/lib/trpc';

const Edit = lazyPrefetch(() => import('./Edit'));
const Remove = lazyPrefetch(() => import('./Remove'));

const Like = lazy(() => import('./Like'));

type InfinitePost = RouterOutputs['post']['infinite']['posts'][0];
type InfiniteComment =
  RouterOutputs['post']['comment']['infinite']['comments'][0];

interface CommentCardProps {
  post: InfinitePost;
  row: InfiniteComment;
}

export default function CommentCard({ post, row }: CommentCardProps) {
  const postId = post.id;

  return (
    <Card className="rounded-none">
      <CardContent className="flex flex-row items-center justify-between p-6">
        <p>{row.content}</p>
        <Like postId={postId} row={row} />
      </CardContent>
      {(row.creator || post.creator) && (
        <CardFooter className="justify-end">
          {row.creator && (
            <LazyButton
              icon={<Pencil />}
              ariaLabel="edit comment"
              onMouseEnter={() => {
                void Edit.prefetch();
              }}
            >
              {(openState) => <Edit postId={postId} row={row} {...openState} />}
            </LazyButton>
          )}
          <LazyButton
            icon={<Trash />}
            ariaLabel="delete comment"
            onMouseEnter={() => {
              void Remove.prefetch();
            }}
          >
            {(openState) => (
              <Remove postId={postId} commentId={row.id} {...openState} />
            )}
          </LazyButton>
        </CardFooter>
      )}
    </Card>
  );
}
