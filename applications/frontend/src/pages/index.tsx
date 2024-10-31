import InfiniteScroll from '../modules/core/components/InfiniteScroll';

interface Project {
  name: string;
  id: number;
}

export default function Home() {
  return (
    <div>
      <InfiniteScroll
        queryKey={['projects']}
        baseUrl={'/api'}
        estimatedElementSize={50}
        height={500}
        renderItem={(item: Project) => <p>{item.name}</p>}
      />
    </div>
  );
}
