import { getSession } from '@auth/express';
import Credentials from '@auth/express/providers/credentials';
import type { Request } from 'express';

export const authConfig = {
  providers: [
    Credentials({
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'test-user' },
      },
      async authorize() {
        return { id: '1', name: 'Test User', email: 'test@example.com' };
      },
    }),
  ],
};

export const getAuth = async (req: Request) => {
  return (await getSession(req, authConfig)) ?? undefined;
};
