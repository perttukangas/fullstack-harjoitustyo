import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getInfinite, getInfiniteCreator } from './database.js';
import { commentRouter } from './index.js';

vi.mock('./database.js', () => ({
  create: vi.fn(),
  edit: vi.fn(),
  getInfinite: vi.fn(),
  getInfiniteCreator: vi.fn(),
  hasLiked: vi.fn(),
  isCreator: vi.fn(),
  isCreatorOrOwnerOfPost: vi.fn(),
  like: vi.fn(),
  remove: vi.fn(),
  removeMany: vi.fn(),
  unlike: vi.fn(),
}));

type RouterContext = {
  userId: bigint | null;
};

describe('commentRouter.infinite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createCaller = (ctx: RouterContext) =>
    commentRouter.createCaller(ctx as never);

  it('returns comments and no nextCursor when database returns at most limit items', async () => {
    const comments = [
      {
        id: 10n,
        content: 'First visible comment',
        likes: 4,
        creator: false,
        liked: true,
      },
      {
        id: 9n,
        content: 'Second visible comment',
        likes: 0,
        creator: true,
        liked: false,
      },
    ];

    vi.mocked(getInfinite).mockResolvedValueOnce(comments);

    const caller = createCaller({ userId: null });
    const result = await caller.infinite({ postId: 123n, limit: 5 });

    expect(result).toEqual({
      comments,
      nextCursor: undefined,
    });
    expect(getInfinite).toHaveBeenCalledWith({
      postId: 123n,
      limit: 5,
      cursor: undefined,
      userId: undefined,
    });
  });

  it('trims one extra comment and sets nextCursor when database returns limit + 1 items', async () => {
    vi.mocked(getInfinite).mockResolvedValueOnce([
      {
        id: 10n,
        content: 'Comment 10',
        likes: 1,
        creator: false,
        liked: false,
      },
      {
        id: 9n,
        content: 'Comment 9',
        likes: 2,
        creator: false,
        liked: false,
      },
      {
        id: 8n,
        content: 'Comment 8',
        likes: 3,
        creator: false,
        liked: false,
      },
      {
        id: 7n,
        content: 'Comment 7',
        likes: 4,
        creator: false,
        liked: false,
      },
      {
        id: 6n,
        content: 'Comment 6',
        likes: 5,
        creator: false,
        liked: false,
      },
      {
        id: 5n,
        content: 'Comment 5',
        likes: 6,
        creator: false,
        liked: false,
      },
    ]);

    const caller = createCaller({ userId: 777n });
    const result = await caller.infinite({ postId: 5n, limit: 5, cursor: 11n });

    expect(result).toEqual({
      comments: [
        {
          id: 10n,
          content: 'Comment 10',
          likes: 1,
          creator: false,
          liked: false,
        },
        {
          id: 9n,
          content: 'Comment 9',
          likes: 2,
          creator: false,
          liked: false,
        },
        {
          id: 8n,
          content: 'Comment 8',
          likes: 3,
          creator: false,
          liked: false,
        },
        {
          id: 7n,
          content: 'Comment 7',
          likes: 4,
          creator: false,
          liked: false,
        },
        {
          id: 6n,
          content: 'Comment 6',
          likes: 5,
          creator: false,
          liked: false,
        },
      ],
      nextCursor: 5n,
    });
    expect(getInfinite).toHaveBeenCalledWith({
      postId: 5n,
      limit: 5,
      cursor: 11n,
      userId: 777n,
    });
  });
});

describe('commentRouter.infiniteCreator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createCaller = (ctx: RouterContext) =>
    commentRouter.createCaller(ctx as never);

  it('rejects unauthenticated user with UNAUTHORIZED', async () => {
    vi.mocked(getInfiniteCreator).mockResolvedValueOnce([]);

    const caller = createCaller({ userId: null });

    await expect(
      caller.infiniteCreator({ postId: 1n, limit: 5 })
    ).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
    });
    expect(getInfiniteCreator).not.toHaveBeenCalled();
  });

  it('trims last item on forward pagination and returns both cursors', async () => {
    vi.mocked(getInfiniteCreator).mockResolvedValueOnce([
      { id: 55n, content: 'Comment 55' },
      { id: 54n, content: 'Comment 54' },
      { id: 53n, content: 'Comment 53' },
      { id: 52n, content: 'Comment 52' },
      { id: 51n, content: 'Comment 51' },
      { id: 50n, content: 'Comment 50' },
    ]);

    const caller = createCaller({ userId: 200n });
    const result = await caller.infiniteCreator({
      postId: 77n,
      limit: 5,
      direction: 'forward',
      cursor: 60n,
    });

    expect(result).toEqual({
      comments: [
        { id: 55n, content: 'Comment 55' },
        { id: 54n, content: 'Comment 54' },
        { id: 53n, content: 'Comment 53' },
        { id: 52n, content: 'Comment 52' },
        { id: 51n, content: 'Comment 51' },
      ],
      nextCursor: 51n,
      previousCursor: 55n,
    });
  });

  it('trims first item on backward pagination and returns both cursors', async () => {
    vi.mocked(getInfiniteCreator).mockResolvedValueOnce([
      { id: 55n, content: 'Comment 55' },
      { id: 54n, content: 'Comment 54' },
      { id: 53n, content: 'Comment 53' },
      { id: 52n, content: 'Comment 52' },
      { id: 51n, content: 'Comment 51' },
      { id: 50n, content: 'Comment 50' },
    ]);

    const caller = createCaller({ userId: 200n });
    const result = await caller.infiniteCreator({
      postId: 77n,
      limit: 5,
      direction: 'backward',
      cursor: 49n,
    });

    expect(result).toEqual({
      comments: [
        { id: 54n, content: 'Comment 54' },
        { id: 53n, content: 'Comment 53' },
        { id: 52n, content: 'Comment 52' },
        { id: 51n, content: 'Comment 51' },
        { id: 50n, content: 'Comment 50' },
      ],
      nextCursor: 50n,
      previousCursor: 54n,
    });
  });

  it('sets previousCursor undefined when first page is requested without cursor', async () => {
    vi.mocked(getInfiniteCreator).mockResolvedValueOnce([
      { id: 30n, content: 'Comment 30' },
      { id: 29n, content: 'Comment 29' },
      { id: 28n, content: 'Comment 28' },
      { id: 27n, content: 'Comment 27' },
      { id: 26n, content: 'Comment 26' },
      { id: 25n, content: 'Comment 25' },
    ]);

    const caller = createCaller({ userId: 301n });
    const result = await caller.infiniteCreator({
      postId: 88n,
      limit: 5,
      direction: 'forward',
    });

    expect(result).toEqual({
      comments: [
        { id: 30n, content: 'Comment 30' },
        { id: 29n, content: 'Comment 29' },
        { id: 28n, content: 'Comment 28' },
        { id: 27n, content: 'Comment 27' },
        { id: 26n, content: 'Comment 26' },
      ],
      nextCursor: 26n,
      previousCursor: undefined,
    });
  });

  it('keeps both cursors when direction is omitted and there are no extra items', async () => {
    vi.mocked(getInfiniteCreator).mockResolvedValueOnce([
      { id: 70n, content: 'Comment 70' },
      { id: 69n, content: 'Comment 69' },
    ]);

    const caller = createCaller({ userId: 111n });
    const result = await caller.infiniteCreator({
      postId: 99n,
      limit: 5,
      cursor: 71n,
      direction: undefined,
    });

    expect(result).toEqual({
      comments: [
        { id: 70n, content: 'Comment 70' },
        { id: 69n, content: 'Comment 69' },
      ],
      nextCursor: 69n,
      previousCursor: 70n,
    });
  });
});
