import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getInfinite, getInfiniteCreator } from './database.js';
import { postRouter } from './index.js';

vi.mock('./database.js', () => ({
  create: vi.fn(),
  edit: vi.fn(),
  getInfinite: vi.fn(),
  getInfiniteCreator: vi.fn(),
  hasLiked: vi.fn(),
  isCreator: vi.fn(),
  like: vi.fn(),
  remove: vi.fn(),
  removeMany: vi.fn(),
  unlike: vi.fn(),
}));

vi.mock('./comment/index.js', async () => {
  const { publicProcedure, router } = await import('@apiv1/trpc/index.js');

  return {
    commentRouter: router({
      health: publicProcedure.query(() => null),
    }),
  };
});

type RouterContext = {
  userId: bigint | null;
};

describe('postRouter.infinite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createCaller = (ctx: RouterContext) =>
    postRouter.createCaller(ctx as never);

  it('returns posts and no nextCursor when database returns at most limit items', async () => {
    const posts = [
      {
        id: 50n,
        title: 'Frontend performance tips',
        content: 'Use profiler before optimizing anything.',
        likes: 4,
        comments: 2,
        creator: true,
        liked: false,
      },
      {
        id: 49n,
        title: 'Docker compose for local dev',
        content: 'Keep DB and API startup deterministic.',
        likes: 7,
        comments: 3,
        creator: false,
        liked: true,
      },
    ];

    vi.mocked(getInfinite).mockResolvedValueOnce(posts);

    const caller = createCaller({ userId: null });
    const result = await caller.infinite({ limit: 5 });

    expect(result).toEqual({
      posts,
      nextCursor: undefined,
    });
    expect(getInfinite).toHaveBeenCalledWith({
      cursor: undefined,
      limit: 5,
      userId: undefined,
    });
  });

  it('trims one extra post and returns nextCursor when database returns limit + 1 items', async () => {
    vi.mocked(getInfinite).mockResolvedValueOnce([
      {
        id: 20n,
        title: 'Post A',
        content: 'A content',
        likes: 1,
        comments: 1,
        creator: false,
        liked: false,
      },
      {
        id: 19n,
        title: 'Post B',
        content: 'B content',
        likes: 2,
        comments: 0,
        creator: false,
        liked: false,
      },
      {
        id: 18n,
        title: 'Post C',
        content: 'C content',
        likes: 5,
        comments: 4,
        creator: true,
        liked: true,
      },
      {
        id: 17n,
        title: 'Post D',
        content: 'D content',
        likes: 6,
        comments: 0,
        creator: false,
        liked: false,
      },
      {
        id: 16n,
        title: 'Post E',
        content: 'E content',
        likes: 0,
        comments: 3,
        creator: false,
        liked: false,
      },
      {
        id: 15n,
        title: 'Post F',
        content: 'F content',
        likes: 2,
        comments: 2,
        creator: false,
        liked: false,
      },
    ]);

    const caller = createCaller({ userId: 123n });
    const result = await caller.infinite({ limit: 5 });

    expect(result).toEqual({
      posts: [
        {
          id: 20n,
          title: 'Post A',
          content: 'A content',
          likes: 1,
          comments: 1,
          creator: false,
          liked: false,
        },
        {
          id: 19n,
          title: 'Post B',
          content: 'B content',
          likes: 2,
          comments: 0,
          creator: false,
          liked: false,
        },
        {
          id: 18n,
          title: 'Post C',
          content: 'C content',
          likes: 5,
          comments: 4,
          creator: true,
          liked: true,
        },
        {
          id: 17n,
          title: 'Post D',
          content: 'D content',
          likes: 6,
          comments: 0,
          creator: false,
          liked: false,
        },
        {
          id: 16n,
          title: 'Post E',
          content: 'E content',
          likes: 0,
          comments: 3,
          creator: false,
          liked: false,
        },
      ],
      nextCursor: 15n,
    });
  });

  it('forwards authenticated userId to getInfinite', async () => {
    vi.mocked(getInfinite).mockResolvedValueOnce([]);

    const caller = createCaller({ userId: 987n });
    await caller.infinite({ limit: 5, cursor: 99n });

    expect(getInfinite).toHaveBeenCalledWith({
      cursor: 99n,
      limit: 5,
      userId: 987n,
    });
  });

  it('uses schema defaults when optional input fields are omitted', async () => {
    vi.mocked(getInfinite).mockResolvedValueOnce([]);

    const caller = createCaller({ userId: null });
    const result = await caller.infinite({});

    expect(result).toEqual({
      posts: [],
      nextCursor: undefined,
    });
    expect(getInfinite).toHaveBeenCalledWith({
      cursor: undefined,
      limit: 20,
      userId: undefined,
    });
  });

  it('parses string cursor input to bigint before calling getInfinite', async () => {
    vi.mocked(getInfinite).mockResolvedValueOnce([]);

    const caller = createCaller({ userId: null });
    await caller.infinite({ limit: 5, cursor: '42' });

    expect(getInfinite).toHaveBeenCalledWith({
      cursor: 42n,
      limit: 5,
      userId: undefined,
    });
  });

  it('rejects too small limit with BAD_REQUEST', async () => {
    vi.mocked(getInfinite).mockResolvedValueOnce([]);

    const caller = createCaller({ userId: null });

    await expect(caller.infinite({ limit: 4 })).rejects.toMatchObject({
      code: 'BAD_REQUEST',
    });
    expect(getInfinite).not.toHaveBeenCalled();
  });

  it('rejects non-numeric limit input with BAD_REQUEST', async () => {
    vi.mocked(getInfinite).mockResolvedValueOnce([]);

    const caller = createCaller({ userId: null });

    await expect(
      caller.infinite({ limit: 'ten' } as never)
    ).rejects.toMatchObject({
      code: 'BAD_REQUEST',
    });
    expect(getInfinite).not.toHaveBeenCalled();
  });
});

describe('postRouter.infiniteCreator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createCaller = (ctx: RouterContext) =>
    postRouter.createCaller(ctx as never);

  it('rejects unauthenticated user with UNAUTHORIZED', async () => {
    vi.mocked(getInfiniteCreator).mockResolvedValueOnce([]);

    const caller = createCaller({ userId: null });

    await expect(caller.infiniteCreator({ limit: 5 })).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
    });
    expect(getInfiniteCreator).not.toHaveBeenCalled();
  });

  it('trims last item on forward pagination and returns both cursors', async () => {
    vi.mocked(getInfiniteCreator).mockResolvedValueOnce([
      { id: 55n, title: 'Post 55', content: 'A' },
      { id: 54n, title: 'Post 54', content: 'B' },
      { id: 53n, title: 'Post 53', content: 'C' },
      { id: 52n, title: 'Post 52', content: 'D' },
      { id: 51n, title: 'Post 51', content: 'E' },
      { id: 50n, title: 'Post 50', content: 'F' },
    ]);

    const caller = createCaller({ userId: 200n });
    const result = await caller.infiniteCreator({
      limit: 5,
      direction: 'forward',
      cursor: 60n,
    });

    expect(result).toEqual({
      posts: [
        { id: 55n, title: 'Post 55', content: 'A' },
        { id: 54n, title: 'Post 54', content: 'B' },
        { id: 53n, title: 'Post 53', content: 'C' },
        { id: 52n, title: 'Post 52', content: 'D' },
        { id: 51n, title: 'Post 51', content: 'E' },
      ],
      nextCursor: 51n,
      previousCursor: 55n,
    });
  });

  it('trims first item on backward pagination and returns both cursors', async () => {
    vi.mocked(getInfiniteCreator).mockResolvedValueOnce([
      { id: 55n, title: 'Post 55', content: 'A' },
      { id: 54n, title: 'Post 54', content: 'B' },
      { id: 53n, title: 'Post 53', content: 'C' },
      { id: 52n, title: 'Post 52', content: 'D' },
      { id: 51n, title: 'Post 51', content: 'E' },
      { id: 50n, title: 'Post 50', content: 'F' },
    ]);

    const caller = createCaller({ userId: 200n });
    const result = await caller.infiniteCreator({
      limit: 5,
      direction: 'backward',
      cursor: 49n,
    });

    expect(result).toEqual({
      posts: [
        { id: 54n, title: 'Post 54', content: 'B' },
        { id: 53n, title: 'Post 53', content: 'C' },
        { id: 52n, title: 'Post 52', content: 'D' },
        { id: 51n, title: 'Post 51', content: 'E' },
        { id: 50n, title: 'Post 50', content: 'F' },
      ],
      nextCursor: 50n,
      previousCursor: 54n,
    });
  });

  it('sets nextCursor undefined when moving forward and there are no more items', async () => {
    vi.mocked(getInfiniteCreator).mockResolvedValueOnce([
      { id: 44n, title: 'Post 44', content: 'A' },
      { id: 43n, title: 'Post 43', content: 'B' },
      { id: 42n, title: 'Post 42', content: 'C' },
      { id: 41n, title: 'Post 41', content: 'D' },
      { id: 40n, title: 'Post 40', content: 'E' },
    ]);

    const caller = createCaller({ userId: 300n });
    const result = await caller.infiniteCreator({
      limit: 5,
      direction: 'forward',
      cursor: 45n,
    });

    expect(result).toEqual({
      posts: [
        { id: 44n, title: 'Post 44', content: 'A' },
        { id: 43n, title: 'Post 43', content: 'B' },
        { id: 42n, title: 'Post 42', content: 'C' },
        { id: 41n, title: 'Post 41', content: 'D' },
        { id: 40n, title: 'Post 40', content: 'E' },
      ],
      nextCursor: undefined,
      previousCursor: 44n,
    });
  });

  it('forwards undefined direction and parses string cursor to bigint', async () => {
    vi.mocked(getInfiniteCreator).mockResolvedValueOnce([]);

    const caller = createCaller({ userId: 777n });
    await caller.infiniteCreator({ limit: 5, cursor: '100' });

    expect(getInfiniteCreator).toHaveBeenCalledWith({
      cursor: 100n,
      direction: undefined,
      limit: 5,
      userId: 777n,
    });
  });

  it('sets previousCursor undefined when first page is requested without cursor', async () => {
    vi.mocked(getInfiniteCreator).mockResolvedValueOnce([
      { id: 30n, title: 'Post 30', content: 'A' },
      { id: 29n, title: 'Post 29', content: 'B' },
      { id: 28n, title: 'Post 28', content: 'C' },
      { id: 27n, title: 'Post 27', content: 'D' },
      { id: 26n, title: 'Post 26', content: 'E' },
      { id: 25n, title: 'Post 25', content: 'F' },
    ]);

    const caller = createCaller({ userId: 301n });
    const result = await caller.infiniteCreator({
      limit: 5,
      direction: 'forward',
    });

    expect(result).toEqual({
      posts: [
        { id: 30n, title: 'Post 30', content: 'A' },
        { id: 29n, title: 'Post 29', content: 'B' },
        { id: 28n, title: 'Post 28', content: 'C' },
        { id: 27n, title: 'Post 27', content: 'D' },
        { id: 26n, title: 'Post 26', content: 'E' },
      ],
      nextCursor: 26n,
      previousCursor: undefined,
    });
  });

  it('rejects invalid direction input with BAD_REQUEST', async () => {
    vi.mocked(getInfiniteCreator).mockResolvedValueOnce([]);

    const caller = createCaller({ userId: 301n });

    await expect(
      caller.infiniteCreator({ limit: 5, direction: 'sideways' } as never)
    ).rejects.toMatchObject({
      code: 'BAD_REQUEST',
    });
    expect(getInfiniteCreator).not.toHaveBeenCalled();
  });
});
