import { produce } from 'immer';
import { Heart } from 'lucide-react';

import { Button } from '@cc/components/Button';
import { useSession } from '@cc/hooks/use-session';
import { type RouterOutputs, t } from '@cc/lib/trpc';
import { compareEqual, compareLessThan } from '@cc/utils/bigint';

type InfinitePost = RouterOutputs['post']['infinite']['posts'][0];

interface LikeProps {
  row: InfinitePost;
}

export default function Like({ row }: LikeProps) {
  const tUtils = t.useUtils();
  const { user } = useSession();

  const createLikeMutation = (type: 'like' | 'unlike') => {
    return t.post[type].useMutation({
      onSuccess: (_, variables) => {
        const { id } = variables;
        tUtils.post.infinite.setInfiniteData({}, (oldData) => {
          return !oldData
            ? oldData
            : produce(oldData, (draft) => {
                for (const page of draft.pages) {
                  if (
                    !page.nextCursor ||
                    compareLessThan(page.nextCursor, id)
                  ) {
                    for (const post of page.posts) {
                      if (compareEqual(post.id, id)) {
                        post.likes += type === 'like' ? 1 : -1;
                        post.liked = type === 'like';
                        break;
                      }
                    }
                    break;
                  }
                }
              });
        });
      },
    });
  };

  const likeMutation = createLikeMutation('like');
  const unlikeMutation = createLikeMutation('unlike');

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        aria-label="post-like"
        onClick={() => {
          if (row.liked) {
            unlikeMutation.mutate({ id: row.id });
          } else {
            likeMutation.mutate({ id: row.id });
          }
        }}
        disabled={!user}
      >
        <Heart className={row.liked ? 'fill-primary' : ''} />
      </Button>
      <p>{row.likes}</p>
    </>
  );
}
