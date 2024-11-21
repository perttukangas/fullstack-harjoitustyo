import { useEffect, useState } from 'react';

import type { SessionSchema } from '@apiv1/trpc/validators.js';

import { SessionContext } from '@cc/hooks/use-session';
import { t } from '@cc/lib/trpc';
import {
  StorageType,
  getItem,
  removeItem,
  setItem,
} from '@cc/utils/local-storage';

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setStateUser] = useState<SessionSchema | undefined>();
  const { data, isPending } = t.user.authorized.useQuery();

  const setUser = (user: SessionSchema | undefined) => {
    setStateUser(user);
    if (user) {
      setItem(StorageType.USER, user);
    } else {
      removeItem(StorageType.USER);
    }
  };

  useEffect(() => {
    if (!isPending && !user) {
      const localUser = getItem(StorageType.USER);
      if (localUser) {
        if (!data) {
          removeItem(StorageType.USER);
        } else {
          setUser(localUser);
        }
      }
    }
  }, [isPending, user, data]);

  return (
    <SessionContext.Provider value={{ user, setUser }}>
      {children}
    </SessionContext.Provider>
  );
}
