import { fail } from 'k6';
import http from 'k6/http';

import { SETUP } from './tags.js';

export const getCsrf = () => {
  const res = http.get(`${__ENV.BASE_URL}/api/csrf`, SETUP);
  const csrfValue = res.json('token')?.toString();
  const csrfCookieValue = res.cookies['__Host-auth.x-csrf-token'][0].value;

  if (!csrfValue || !csrfCookieValue) {
    fail(`CSRF value or cookie value missing ${csrfValue} ${csrfCookieValue}`);
  }

  return { csrfValue, csrfCookieValue };
};

interface AuthInputs {
  csrf: ReturnType<typeof getCsrf>;
  email: string;
  password: string;
}

interface SessionSchema {
  id: number;
}

export const getAuth = ({ csrf, email, password }: AuthInputs) => {
  const headers = {
    'Content-Type': 'application/json',
    'x-csrf-token': csrf.csrfValue,
    Cookie: `__Host-auth.x-csrf-token=${csrf.csrfCookieValue}`,
  };

  const loginPayload = JSON.stringify({ email, password });
  const res = http.post(`${__ENV.BASE_URL}/api/v1/user.login`, loginPayload, {
    headers,
    ...SETUP,
  });
  const authCookieValue = res.cookies['AUTH_SESSION_TOKEN'][0].value;

  if (!authCookieValue) {
    fail(`Auth cookie value missing`);
  }

  const jsonResponse = res.json() as unknown as {
    result: { data: SessionSchema };
  };
  const session = jsonResponse?.result?.data;

  if (!session.id) {
    fail(`Session id missing ${JSON.stringify(session)}`);
  }

  return {
    headers: {
      ...headers,
      Cookie: `${headers.Cookie}; AUTH_SESSION_TOKEN=${authCookieValue}`,
    },
    session,
  };
};

export const createAuth = ({ csrf, email, password }: AuthInputs) => {
  const headers = {
    'Content-Type': 'application/json',
    'x-csrf-token': csrf.csrfValue,
    Cookie: `__Host-auth.x-csrf-token=${csrf.csrfCookieValue}`,
  };

  const loginPayload = JSON.stringify({ email, password });
  const res = http.post(`${__ENV.BASE_URL}/api/v1/user.signup`, loginPayload, {
    headers,
    ...SETUP,
  });

  if (res.status !== 201) {
    fail(`Acoount create failed`);
  }
};
