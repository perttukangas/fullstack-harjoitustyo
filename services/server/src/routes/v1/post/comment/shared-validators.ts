import { z } from 'zod';

interface ProtectedOptional {
  userId?: number;
}

interface Protected {
  userId: number;
}

export const infiniteInput = z.object({
  postId: z.number(),
  limit: z.number().min(5).max(30).default(20),
  cursor: z.number().nullish(),
  direction: z.enum(['forward', 'backward']).default('forward').optional(),
});
export type InfiniteInput = z.infer<typeof infiniteInput> & ProtectedOptional;
export type InfiniteCreatorInput = z.infer<typeof infiniteInput>;

export const likeUnlikeInput = z.object({ id: z.number() });
export type ProtectedLikeUnlikeInput = z.infer<typeof likeUnlikeInput> &
  Protected;

export const createInput = z.object({
  postId: z.number(),
  content: z.string().min(10).max(5000),
});
export type CreateInput = z.infer<typeof createInput>;
export type ProtectedCreateInput = CreateInput & Protected;

export const removeInput = z.object({ id: z.number() });
export type RemoveInput = z.infer<typeof removeInput>;

export const removeManyInput = z.object({ ids: z.array(z.number()) });
export type ProtectedRemoveManyInput = z.infer<typeof removeManyInput> &
  Protected;

export const editInput = z.object({
  id: z.number(),
  content: z.string().min(10).max(5000),
});
export type EditInput = z.infer<typeof editInput>;
export type ProtectedEditInput = EditInput & Protected;
