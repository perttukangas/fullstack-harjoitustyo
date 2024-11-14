import { useEffect, useState } from 'react';

import { SessionContext } from '@c/core/hooks/use-session';
import { t } from '@c/core/lib/trpc';
import {
  StorageType,
  getItem,
  removeItem,
  setItem,
} from '@c/core/utils/local-storage';

import { type SessionSchema } from '@apiv1/trpc/validators.js';

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
          setItem(StorageType.USER, localUser);
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
