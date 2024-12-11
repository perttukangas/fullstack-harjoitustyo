import { produce } from 'immer';
import { Heart } from 'lucide-react';

import { UnparsedDefaultId } from '@shared/zod/common';

import { Button } from '@cc/components/Button';
import { useSession } from '@cc/hooks/use-session';
import { type RouterOutputs, t } from '@cc/lib/trpc';

type InfiniteComment =
  RouterOutputs['post']['comment']['infinite']['comments'][0];

interface LikeProps {
  postId: UnparsedDefaultId;
  row: InfiniteComment;
}

export default function Like({ postId, row }: LikeProps) {
  const tUtils = t.useUtils();
  const { user } = useSession();

  const createLikeMutation = (type: 'like' | 'unlike') => {
    return t.post.comment[type].useMutation({
      onSuccess: (_data, variables) => {
        const { id } = variables;
        tUtils.post.comment.infinite.setInfiniteData({ postId }, (oldData) => {
          return !oldData
            ? oldData
            : produce(oldData, (draft) => {
                for (const page of draft.pages) {
                  if (!page.nextCursor || page.nextCursor < id) {
                    for (const comment of page.comments) {
                      if (comment.id === id) {
                        comment.likes += type === 'like' ? 1 : -1;
                        comment.liked = type === 'like';
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
    <div className="flex items-center justify-start">
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
    </div>
  );
}
