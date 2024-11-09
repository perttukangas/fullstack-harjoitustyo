import { z } from 'zod';

export const infiniteInput = z.object({
  postId: z.number(),
  limit: z.number().min(5).max(100).default(20),
  cursor: z.number().nullish(),
});
export type InfiniteInput = z.infer<typeof infiniteInput>;

interface Protected {
  userId: number;
}

export const likeInput = z.object({ commentId: z.number() });
export type ProtectedLikeInput = z.infer<typeof likeInput> & Protected;

export const createInput = z.object({
  postId: z.number(),
  content: z.string().min(10).max(5000),
});
export type ProtectedCreateInput = z.infer<typeof createInput> & Protected;
