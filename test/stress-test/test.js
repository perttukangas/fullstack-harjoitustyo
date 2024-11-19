// docker run -i --network="host" grafana/k6 run - <test.js

import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "15s", target: 20 },
    { duration: "30s", target: 20 },
    { duration: "15s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<500"],
  },
};

export default function () {
  const csrfRes = http.get("http://localhost:5173/api/csrf");
  check(csrfRes, { "status is 200": (r) => r.status === 200 });
  //console.log(csrfRes.body);

  sleep(1);
}
