import { z } from 'zod';

import { type Protected, type ProtectedOptional, defaultId } from './common.js';

export const infiniteInput = z.object({
  limit: z.number().min(5).max(30).default(20),
  cursor: defaultId.nullish(),
  direction: z.enum(['forward', 'backward']).default('forward').optional(),
});
export type InfiniteInput = z.infer<typeof infiniteInput> & ProtectedOptional;
export type InfiniteCreatorInput = z.infer<typeof infiniteInput> & Protected;

export const likeUnlikeInput = z.object({ id: defaultId });
export type ProtectedLikeUnlikeInput = z.infer<typeof likeUnlikeInput> &
  Protected;

export const createInput = z.object({
  title: z.string().min(5).max(100),
  content: z.string().min(10).max(5000),
});
export type CreateInput = z.infer<typeof createInput>;
export type ProtectedCreateInput = CreateInput & Protected;

export const removeInput = z.object({ id: defaultId });
export type RemoveInput = z.infer<typeof removeInput>;

export const removeManyInput = z.object({ ids: z.array(defaultId) });
export type ProtectedRemoveManyInput = z.infer<typeof removeManyInput> &
  Protected;

export const editInput = z.object({
  id: defaultId,
  title: z.string().min(5).max(100),
  content: z.string().min(10).max(5000),
});
export type EditInput = z.infer<typeof editInput>;
export type ProtectedEditInput = EditInput & Protected;
