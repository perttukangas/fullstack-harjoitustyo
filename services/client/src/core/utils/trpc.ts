import { createTRPCReact } from '@trpc/react-query';

import type { AppRouter } from '../../../../server/src/routes/v1/routes';

export const trpc = createTRPCReact<AppRouter>();
