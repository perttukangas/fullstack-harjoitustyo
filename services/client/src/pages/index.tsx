import { produce } from 'immer';
import { Heart } from 'lucide-react';

import { Button } from '@cc/components/Button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@cc/components/Card';
import InfiniteScrollWindow from '@cc/components/InfiniteScrollWindow';
import { useSession } from '@cc/hooks/use-session';
import { t } from '@cc/lib/trpc';

import CommentLoader from './_components/Comment/CommentLoader';
import PostFormLoader from './_components/Post/PostFormLoader';
import RemovePostLoader from './_components/Post/RemovePostLoader';

export default function Home() {
  const { user } = useSession();
  const tUtils = t.useUtils();
  const infinitePosts = t.post.infinite.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    }
  );
  const { data } = infinitePosts;
  const allRows = data ? data.pages.flatMap((d) => d.posts) : [];

  const createLikeMutation = (type: 'like' | 'unlike') => {
    return t.post[type].useMutation({
      onSuccess: (_data, variables) => {
        const { id } = variables;
        tUtils.post.infinite.setInfiniteData({}, (oldData) => {
          return !oldData
            ? oldData
            : produce(oldData, (draft) => {
                for (const page of draft.pages) {
                  if (!page.nextCursor || page.nextCursor < id) {
                    for (const post of page.posts) {
                      if (post.id === id) {
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
    <div className="mx-auto max-w-screen-lg">
      <InfiniteScrollWindow
        className="infinite-scroll-posts"
        allRows={allRows}
        renderRow={(row) => {
          return (
            <Card className="rounded-none">
              <CardHeader className="flex-row items-center justify-between gap-1">
                <CardTitle>{row.title}</CardTitle>
                {row.creator && (
                  <div className="flex items-center gap-1">
                    <PostFormLoader edit={row} />
                    <RemovePostLoader id={row.id} />
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <p>{row.content}</p>
              </CardContent>
              <CardFooter className="flex-row items-center justify-start gap-1">
                <Button
                  variant="ghost"
                  size="icon"
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
                <CommentLoader {...row} />
              </CardFooter>
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
        {...infinitePosts}
      />
    </div>
  );
}
