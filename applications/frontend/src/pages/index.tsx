import InfiniteScroll from '@core/components/InfiniteScroll';
import { Post } from '@prisma/client';

export default function Default() {
  return (
    <div>
      <InfiniteScroll
        baseUrl={'/api/v1/post'}
        estimatedElementSize={100}
        dynamicElementSize={true}
        height={500}
        renderItem={(item: Post) => (
          <>
            <h2>
              <a href={`/post/${item.id}`}>{item.title}</a>
            </h2>
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
