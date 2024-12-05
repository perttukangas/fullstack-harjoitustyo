import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import 'dotenv/config';

import { NODE_ENV, isTest } from '@sc/lib/envalid.js';

Sentry.init({
  dsn: 'https://6f64f4076164879fe2f585a5ea3011b9@o4506016471777280.ingest.us.sentry.io/4508320219398144',
  integrations: [nodeProfilingIntegration(), Sentry.prismaIntegration()],

  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,

  environment: NODE_ENV,
  enabled: !isTest,
});

BigInt.prototype.toJSON = function () {
  return this.toString();
};
