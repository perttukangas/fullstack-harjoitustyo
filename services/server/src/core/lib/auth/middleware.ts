import { ExpressAuth } from '@auth/express';

import { authConfig } from './index.js';

export const authMiddleware = ExpressAuth(authConfig);
