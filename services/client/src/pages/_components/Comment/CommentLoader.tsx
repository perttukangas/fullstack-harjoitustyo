import { MessageCircle } from 'lucide-react';
import { Suspense, lazy, useState } from 'react';

import { Button } from '@cc/components/Button';
import Loader from '@cc/components/Loader';
import { RouterOutputs } from '@cc/lib/trpc';

const Comment = lazy(() => import('./Comment'));

type InfinitePost = RouterOutputs['post']['infinite']['posts'][0];

export default function CommentLoader(post: InfinitePost) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        aria-label="post-comments"
        onClick={() => setOpen(true)}
        variant="ghost"
        size="icon"
      >
        <MessageCircle />
      </Button>
      <p>{post.comments}</p>
      {open && (
        <Suspense fallback={<Loader />}>
          <Comment post={post} open={open} setOpen={setOpen} />
        </Suspense>
      )}
    </>
  );
}
