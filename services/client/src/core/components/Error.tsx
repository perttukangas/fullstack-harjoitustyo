import { isTRPCClientError } from '@core/utils/trpc';

export default function Error({ error }: { error: unknown }) {
  if (isTRPCClientError(error)) {
    return <p>Error: {error.message}</p>;
  }

  return <p>An unknown error occurred</p>;
}
