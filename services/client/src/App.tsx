import RoutesProvider from '@c/core/components/Providers/RoutesProvider';
import ThemeProvider from '@c/core/components/Providers/ThemeProvider';
import { Toaster } from '@c/core/components/Providers/Toaster';
import TrpcProvider from '@c/core/components/Providers/TrpcProvider';

export default function App() {
  return (
    <TrpcProvider>
      <ThemeProvider>
        <RoutesProvider />
        <Toaster />
      </ThemeProvider>
    </TrpcProvider>
  );
}
