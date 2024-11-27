import { MessageCircle, Pencil, Trash } from 'lucide-react';
import { lazy } from 'react';

import { Button } from '@cc/components/Button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@cc/components/Card';
import LazyButton from '@cc/components/LazyButton';
import { lazyPrefetch } from '@cc/lib/lazy-prefetch';
import { type RouterOutputs } from '@cc/lib/trpc';

const CommentList = lazyPrefetch(() => import('../Comment/List'));

const Edit = lazyPrefetch(() => import('./Edit'));
const Remove = lazyPrefetch(() => import('./Remove'));

const Like = lazy(() => import('./Like'));

type InfinitePost = RouterOutputs['post']['infinite']['posts'][0];

interface PostCardProps {
  row: InfinitePost;
}

export default function PostCard({ row }: PostCardProps) {
  return (
    <Card className="rounded-none">
      <CardHeader className="flex-row items-center justify-between gap-1">
        <CardTitle>{row.title}</CardTitle>
        {row.creator && (
          <div className="flex items-center gap-1">
            <LazyButton
              icon={<Pencil />}
              onMouseEnter={() => {
                void Edit.prefetch();
              }}
            >
              {(openState) => <Edit row={row} {...openState} />}
            </LazyButton>
            <LazyButton
              icon={<Trash />}
              onMouseEnter={() => {
                void Remove.prefetch();
              }}
            >
              {(openState) => <Remove row={row} {...openState} />}
            </LazyButton>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <p>{row.content}</p>
      </CardContent>
      <CardFooter className="flex-row items-center justify-start gap-1">
        <Like row={row} />
        <LazyButton
          button={({ setOpen }) => (
            <>
              <Button
                onMouseEnter={() => {
                  void CommentList.prefetch();
                }}
                onClick={() => setOpen(true)}
                variant="ghost"
                size="icon"
              >
                <MessageCircle />
              </Button>
              <p>{row.comments}</p>
            </>
          )}
        >
          {(openState) => <CommentList post={row} {...openState} />}
        </LazyButton>
      </CardFooter>
    </Card>
  );
}
