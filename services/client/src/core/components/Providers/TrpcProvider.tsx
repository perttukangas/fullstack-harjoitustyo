import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useEffect } from 'react';

import {
  Provider,
  queryClient,
  setCsrfToken,
  trpcClient,
} from '@c/core/lib/trpc';

interface CsrfToken {
  token: string;
}

export default function TrpcProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const fetchCsrfToken = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/csrf`,
        {
          credentials: 'include',
        }
      );
      const data = (await response.json()) as CsrfToken;
      setCsrfToken(data.token);
    };

    void fetchCsrfToken();
  }, []);

  return (
    <Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  );
}
