import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { httpBatchLink } from '@trpc/client';
import { useEffect, useState } from 'react';

import { Provider, t } from '@c/core/utils/trpc';

interface CsrfToken {
  token: string;
}

export default function TrpcProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const serverUrl = import.meta.env.VITE_SERVER_URL as string;
  if (!serverUrl) {
    throw new Error('VITE_SERVER_URL is not defined');
  }

  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient, setTrpcClient] = useState<ReturnType<
    typeof t.createClient
  > | null>(null);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      const response = await fetch(`${serverUrl}/api/csrf`, {
        credentials: 'include',
      });
      const data = (await response.json()) as CsrfToken;
      const client = t.createClient({
        links: [
          httpBatchLink({
            url: `${serverUrl}/api/v1`,
            headers() {
              return {
                'x-csrf-token': data.token,
              };
            },
            fetch(url, options) {
              return fetch(url, {
                ...options,
                credentials: 'include',
              });
            },
          }),
        ],
      });

      setTrpcClient(client);
    };

    void fetchCsrfToken();
  }, [serverUrl]);

  if (!trpcClient) {
    return <p>Loading...</p>;
  }

  return (
    <Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  );
}
