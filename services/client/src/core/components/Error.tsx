import { isTRPCClientError } from '@core/utils/trpc';

export function Error({ error }: { error: unknown }) {
  if (isTRPCClientError(error)) {
    return <p>Error: {error.message}</p>;
  }

  return <p>An unknown error occurred</p>;
}
