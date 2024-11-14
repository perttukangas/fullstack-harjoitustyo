import { Heart, MessageCircle } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@c/core/components/Button';
import { Card, CardContent, CardFooter } from '@c/core/components/Card';
import DrawerDialog from '@c/core/components/DrawerDialog';
import InfiniteScroll from '@c/core/components/InfiniteScroll';
import { RouterOutputs, t } from '@c/core/lib/trpc';

import CommentForm from './CreateForm';
import EditForm from './EditForm';
import RemoveComment from './RemoveComment';

type InfinitePost = RouterOutputs['post']['infinite']['posts'][0];

export default function Comment(post: InfinitePost) {
  const [open, setOpen] = useState(false);

  const infiniteComments = t.post.comment.infinite.useInfiniteQuery(
    { postId: post.id },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    }
  );
  const { data } = infiniteComments;
  const allRows = data ? data.pages.flatMap((d) => d.comments) : [];

  return (
    <DrawerDialog
      trigger={
        <>
          <Button onClick={() => setOpen(true)} variant="ghost" size="icon">
            <MessageCircle />
          </Button>
          <p>{post.comments}</p>
        </>
      }
      title={post.title}
      description={post.content}
      open={open}
      setOpen={setOpen}
      footer={<CommentForm postId={post.id} />}
    >
      <InfiniteScroll
        className={'infinite-scroll-comments'}
        allRows={allRows}
        renderRow={(row) => {
          return (
            <Card className="rounded-none">
              <CardContent className="flex flex-row items-center justify-between p-6">
                <p>{row.content}</p>
                <div className="flex items-center justify-start">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => console.log('LIKE')}
                  >
                    <Heart />
                  </Button>
                  <p>{row.likes}</p>
                </div>
              </CardContent>
              {row.creator && (
                <CardFooter className="justify-end">
                  <EditForm {...row} />
                  <RemoveComment />
                </CardFooter>
              )}
            </Card>
          );
        }}
        nothingMoreToLoad={
          <Card className="rounded-none">
            <CardContent className="items-center p-6 text-center">
              <p>Nothing more to load</p>
            </CardContent>
          </Card>
        }
        estimateSize={200}
        {...infiniteComments}
      />
    </DrawerDialog>
  );
}
