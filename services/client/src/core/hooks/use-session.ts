import { createContext, useContext } from 'react';

import type { SessionSchema } from '@shared/zod/user';

export const SessionContext = createContext<
  | {
      user: SessionSchema | undefined;
      setUser: (user: SessionSchema | undefined) => void;
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
