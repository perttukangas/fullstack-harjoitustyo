import RoutesProvider from '@c/core/components/Providers/RoutesProvider';
import ThemeProvider from '@c/core/components/Providers/ThemeProvider';
import TrpcProvider from '@c/core/components/Providers/TrpcProvider';

export default function App() {
  return (
    <TrpcProvider>
      <ThemeProvider>
        <RoutesProvider />
      </ThemeProvider>
    </TrpcProvider>
  );
}
