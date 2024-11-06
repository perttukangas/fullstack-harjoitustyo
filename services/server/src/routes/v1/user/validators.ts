import { z } from 'zod';

export const loginValidator = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerValidator = loginValidator.extend({
  name: z.string(),
});
