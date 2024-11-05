import RoutesProvider from '@c/core/components/Providers/RoutesProvider';
import TrpcProvider from '@c/core/components/Providers/TrpcProvider';

export default function App() {
  return (
    <TrpcProvider>
      <RoutesProvider />
    </TrpcProvider>
  );
}
