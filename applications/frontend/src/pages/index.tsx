import InfiniteScroll from '../core/components/InfiniteScroll';

interface Project {
  name: string;
  id: number;
}

export default function Home() {
  return (
    <div>
      <InfiniteScroll
        baseUrl={'/api'}
        estimatedElementSize={50}
        height={500}
        renderItem={(item: Project) => <p>{item.name}</p>}
      />
    </div>
  );
}
