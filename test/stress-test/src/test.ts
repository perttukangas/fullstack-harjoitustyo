import { check, sleep } from 'k6';
import http from 'k6/http';
import { Options } from 'k6/options';

import { createAuth, getAuth, getCsrf } from './utils/setup.js';
import { API, API_STR } from './utils/tags.js';

const MAX_VUS = 100;

export const options: Options = {
  stages: [
    { target: MAX_VUS, duration: '90s' },
    { target: MAX_VUS, duration: '210s' },
  ],
  thresholds: {
    [`http_req_failed${API_STR}`]: ['rate<0.01'],
    [`http_req_duration${API_STR}`]: ['p(95)<500'],
  },
};

export function setup() {
  const clients = [];
  for (let i = 0; i < MAX_VUS; i++) {
    const csrf = getCsrf();
    const payload = {
      email: `${i}test@example.com`,
      password: `${i}223344`,
    };
    createAuth({ csrf, ...payload });
    const auth = getAuth({ csrf, ...payload });
    clients.push(auth);
  }
  sleep(5);
  return clients;
}

export default function (clients: ReturnType<typeof setup>) {
  const client = clients[__VU - 1];

  const postPayload = JSON.stringify({
    title: `Aaaaa ${__VU}`,
    content: `Bbbbb Bbbbb ${__VU}`,
  });

  const res = http.post(`${__ENV.BASE_URL}/api/v1/post.create`, postPayload, {
    headers: client.headers,
    ...API,
  });

  check(res, {
    'status is 201': (r) => r.status === 201,
  });

  sleep(1);
}
