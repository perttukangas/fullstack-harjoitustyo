import { Link } from '@tanstack/react-router';
import { produce } from 'immer';

import InfiniteScroll from '@c/core/components/InfiniteScroll';
import Spinner from '@c/core/components/Spinner';
import { clientUtils, t } from '@c/core/utils/trpc';

export const Pending = () => <Spinner />;
export const Loader = async () => {
  const prefetch = await clientUtils.post.infinite.prefetchInfinite({});
  return { prefetch };
};

export default function Index() {
  const infinitePosts = t.post.infinite.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    }
  );

  const tUtils = t.useUtils();
  const postLike = t.post.like.useMutation({
    onSuccess: (_data, variables) => {
      const { postId } = variables;
      tUtils.post.infinite.setInfiniteData({}, (oldData) => {
        return !oldData
          ? oldData
          : produce(oldData, (draft) => {
              draft.pages.forEach((page) => {
                if (!page.nextCursor || page.nextCursor < postId) {
                  page.posts.forEach((post) => {
                    if (post.id === postId) {
                      post._count.likes += 1;
                    }
                  });
                }
              });
            });
      });
    },
  });

  const { data, status } = infinitePosts;
  const allRows = data ? data.pages.flatMap((d) => d.posts) : [];

  const handleLike = async (postId: number) => {
    await postLike.mutateAsync({ postId });
  };

  if (status === 'error') {
    return <p>Error...</p>;
  }

  return (
    <>
      <InfiniteScroll
        className="infinite-scroll-posts"
        allRows={allRows}
        renderRow={(item) => (
          <>
            <Link to="/posts/$id" params={{ id: item.id.toString() }}>
              {item.title}
            </Link>
            <p>
              {item.id} {item.content}
            </p>
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
        {...infinitePosts}
      />
    </>
  );
}
