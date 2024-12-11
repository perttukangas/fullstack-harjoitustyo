import { z } from 'zod';

export const defaultId = z
  .bigint()
  .or(z.string().transform((val) => BigInt(val)));
export type DefaultId = z.infer<typeof defaultId>;
export type UnparsedDefaultId = z.infer<typeof defaultId> | string;

export interface Protected {
  userId: DefaultId;
}

export interface ProtectedOptional {
  userId?: DefaultId;
}
