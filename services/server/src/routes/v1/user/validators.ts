import { z } from 'zod';

export const loginRegisterInput = z.object({
  email: z.string().email().max(100),
  password: z.string().min(6).max(50),
});
export type LoginRegisterInput = z.infer<typeof loginRegisterInput>;
