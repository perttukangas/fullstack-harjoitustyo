import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { httpBatchLink } from '@trpc/client';
import { useState } from 'react';

import { Provider, getToken, t } from '@c/core/utils/trpc';

export default function TrpcProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  const serverUrl = import.meta.env.VITE_SERVER_URL as string;
  if (!serverUrl) {
    throw new Error('VITE_SERVER_URL is not defined');
  }

  const [trpcClient] = useState(() =>
    t.createClient({
      links: [
        httpBatchLink({
          url: `${serverUrl}/api/v1`,
          headers() {
            const token = getToken();
            return {
              Authorization: `bearer ${token ? token : ''}`,
            };
          },
        }),
      ],
    })
  );

  return (
    <Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  );
}
