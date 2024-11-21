import RoutesProvider from '@cc/components/Providers/RoutesProvider';
import SessionProvider from '@cc/components/Providers/SessionProvider';
import ThemeProvider from '@cc/components/Providers/ThemeProvider';
import { Toaster } from '@cc/components/Providers/Toaster';
import TrpcProvider from '@cc/components/Providers/TrpcProvider';

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
