import { z } from 'zod';

interface OptionalUser {
  userId?: number;
}

export const infiniteInput = z.object({
  postId: z.number(),
  limit: z.number().min(5).max(30).default(20),
  cursor: z.number().nullish(),
});
export type InfiniteInput = z.infer<typeof infiniteInput> & OptionalUser;

interface Protected {
  userId: number;
}

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

export const editInput = z.object({
  id: z.number(),
  content: z.string().min(10).max(5000),
});
export type EditInput = z.infer<typeof editInput>;
export type ProtectedEditInput = EditInput & Protected;
