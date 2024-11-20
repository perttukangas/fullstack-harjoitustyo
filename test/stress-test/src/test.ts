// npm run build && docker run -i --network="host" grafana/k6 run - <./dist/test.js
import { sleep } from 'k6';
import http from 'k6/http';

export const options = {
  vus: 5,
  duration: '10s',
};

export function setup() {
  const clients = [];
  for (let i = 0; i < options.vus; i++) {
    const res = http.get('http://localhost:5173/api/csrf');
    const csrfValue = res.json('token')?.toString();
    const csrfCookieValue = res.cookies['__Host-auth.x-csrf-token'][0].value;
    clients.push({ csrfValue, csrfCookieValue });
  }
  return clients;
}

export default function (clients: ReturnType<typeof setup>) {
  const client = clients[__VU - 1];
  const headers = {
    'Content-Type': 'application/json',
    'x-csrf-token': client.csrfValue || '',
    Cookie: `__Host-auth.x-csrf-token=${client.csrfCookieValue}`,
  };
  const payload = JSON.stringify({
    email: 'test@gmail.com',
    password: '123456',
  });
  const res = http.post('http://localhost:5173/api/v1/user.login', payload, {
    headers,
  });
  console.log(res.status);

  sleep(1);
}
