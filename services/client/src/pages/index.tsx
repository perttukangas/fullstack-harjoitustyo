import InfiniteScroll from '@core/components/InfiniteScroll';

export default function Default() {
  return (
    <div>
      <InfiniteScroll
        estimatedElementSize={100}
        dynamicElementSize={true}
        height={500}
      />
    </div>
  );
}
