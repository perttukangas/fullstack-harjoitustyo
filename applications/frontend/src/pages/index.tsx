import InfiniteScroll from '../core/components/InfiniteScroll';

interface Post {
  id: number;
  title: string;
  content: string;
}

export default function Home() {
  return (
    <div>
      <InfiniteScroll
        baseUrl={'/api/v1/posts'}
        estimatedElementSize={100}
        dynamicElementSize={true}
        height={500}
        renderItem={(item: Post) => (
          <>
            <h2>{item.title}</h2>
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
