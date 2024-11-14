import { jwtDecode } from 'jwt-decode';

import { type SessionSchema } from '@apiv1/trpc/validators';

const SESSION_TOKEN_COOKIE = 'AUTH_SESSION_TOKEN';

export default function getSession(): SessionSchema | undefined {
  const name = `${SESSION_TOKEN_COOKIE}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');
  const cookie = cookieArray.find((cookie) => cookie.trim().startsWith(name));
  const token = cookie ? cookie.trim().substring(name.length) : null;
  if (token) {
    return jwtDecode<SessionSchema>(token);
  }
  return undefined;
}
