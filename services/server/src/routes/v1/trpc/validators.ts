import { z } from 'zod';

export const sessionSchema = z.object({
  id: z.number(),
});
export type SessionSchema = z.infer<typeof sessionSchema>;
