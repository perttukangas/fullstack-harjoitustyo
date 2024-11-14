import RoutesProvider from '@c/core/components/Providers/RoutesProvider';
import SessionProvider from '@c/core/components/Providers/SessionProvider';
import ThemeProvider from '@c/core/components/Providers/ThemeProvider';
import { Toaster } from '@c/core/components/Providers/Toaster';
import TrpcProvider from '@c/core/components/Providers/TrpcProvider';

export default function App() {
  return (
    <ThemeProvider>
      <TrpcProvider>
        <SessionProvider>
          <RoutesProvider />
          <Toaster />
        </SessionProvider>
      </TrpcProvider>
      <Toaster />
    </ThemeProvider>
  );
}
