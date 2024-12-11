import { z } from 'zod';

import { UnparsedDefaultId, defaultId } from './common.js';

export const loginSignupInput = z.object({
  email: z.string().email().max(100),
  password: z.string().min(6).max(50),
});
export type LoginSignupInput = z.infer<typeof loginSignupInput>;

export const sessionSchema = z.object({
  id: defaultId,
});
export type SessionSchema = z.infer<typeof sessionSchema>;
export interface UnparsedSessionSchema {
  id: UnparsedDefaultId;
}
