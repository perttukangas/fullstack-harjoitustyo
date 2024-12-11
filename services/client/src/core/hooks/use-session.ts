import { createContext, useContext } from 'react';

import type { UnparsedSessionSchema } from '@shared/zod/user';

export const SessionContext = createContext<
  | {
      user: UnparsedSessionSchema | undefined;
      setUser: (user: UnparsedSessionSchema | undefined) => void;
    }
  | undefined
>(undefined);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
