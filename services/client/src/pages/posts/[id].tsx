import { LoaderFnContext, useMatch } from '@tanstack/react-router';
import { produce } from 'immer';
import { z } from 'zod';

import InfiniteScroll from '@c/core/components/InfiniteScroll';
import Spinner from '@c/core/components/Spinner';
import { clientUtils, t } from '@c/core/utils/trpc';

export const Pending = () => <Spinner />;
export const Loader = async (context: LoaderFnContext) => {
  const parsedParams = z
    .object({ id: z.string().transform((val) => parseInt(val)) })
    .parse(context.params);
  const prefetch = await clientUtils.post.comment.infinite.prefetchInfinite({
    postId: parsedParams.id,
  });
  return { prefetch };
};

export default function Id() {
  const { params } = useMatch({ from: '/posts/$id' });
  const postId = Number(params.id);
  const infinitePostComments = t.post.comment.infinite.useInfiniteQuery(
    { postId },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    }
  );

  const tUtils = t.useUtils();
  const commentLike = t.post.comment.like.useMutation({
    onSuccess: (_data, variables) => {
      const { commentId } = variables;
      tUtils.post.comment.infinite.setInfiniteData({ postId }, (oldData) => {
        return !oldData
          ? oldData
          : produce(oldData, (draft) => {
              draft.pages.forEach((page) => {
                if (!page.nextCursor || page.nextCursor < commentId) {
                  page.comments.forEach((comment) => {
                    if (comment.id === commentId) {
                      comment._count.likes += 1;
                    }
                  });
                }
              });
            });
      });
    },
  });

  const { data, status } = infinitePostComments;
  const allRows = data ? data.pages.flatMap((d) => d.comments) : [];

  const handleLike = async (commentId: number) => {
    await commentLike.mutateAsync({ commentId });
  };

  if (status === 'error') {
    return <p>Error...</p>;
  }

  return (
    <>
      <InfiniteScroll
        className="infinite-scroll-post-comments"
        allRows={allRows}
        renderRow={(item) => (
          <>
            <p>{item.content}</p>
            <p>Likes: {item._count.likes}</p>
            <button
              onClick={() => {
                void handleLike(item.id);
              }}
            >
              Like
            </button>
          </>
        )}
        height={500}
        estimateSize={100}
        {...infinitePostComments}
      />
    </>
  );
}
