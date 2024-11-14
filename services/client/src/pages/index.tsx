import { Heart } from 'lucide-react';

import { Button } from '@c/core/components/Button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@c/core/components/Card';
import InfiniteScrollWindow from '@c/core/components/InfiniteScrollWindow';
import { t } from '@c/core/lib/trpc';

import Comment from './_components/Comment';
import PostForm from './_components/Post/PostForm';
import RemovePost from './_components/Post/RemovePost';

export default function Home() {
  const infinitePosts = t.post.infinite.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    }
  );
  const { data } = infinitePosts;
  const allRows = data ? data.pages.flatMap((d) => d.posts) : [];

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
                    <PostForm edit={row} />
                    <RemovePost />
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
                  onClick={() => console.log('LIKE')}
                >
                  <Heart />
                </Button>
                <p>{row.likes}</p>
                <Comment {...row} />
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
