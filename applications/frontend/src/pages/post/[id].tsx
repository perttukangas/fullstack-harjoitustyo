import InfiniteScroll from '@core/components/InfiniteScroll';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getData } from '@core/utils/fetch-util';
import { Post, Comment } from '@prisma/client';

export default function Default() {
  const { id } = useParams();

  const {
    isPending,
    error,
    data: post,
  } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const jsonResponse = await getData(`/api/v1/post/${id}`);
      return jsonResponse.data as Post;
    },
  });

  if (isPending) return <p>Loading...</p>;

  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <InfiniteScroll
        baseUrl={`/api/v1/post/${id}/comment`}
        estimatedElementSize={100}
        dynamicElementSize={true}
        height={500}
        renderItem={(item: Comment) => (
          <>
            <p>{item.content}</p>
            {item.id % 3 === 0 && (
              <>
                {Array.from({ length: 10 }).map((_, index) => (
                  <p key={index}>{item.content}</p>
                ))}
              </>
            )}
          </>
        )}
      />
    </div>
  );
}
