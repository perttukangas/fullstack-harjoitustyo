import { beforeEach, describe, expect, it, vi } from 'vitest';

import { StatusCode } from '@sc/utils/status-code.js';

import { SESSION_TOKEN_COOKIE } from '@apiv1/trpc/auth.js';

import { userRouter } from './index.js';

const {
  findFirstMock,
  createMock,
  compareMock,
  hashMock,
  signMock,
  verifyMock,
} = vi.hoisted(() => ({
  findFirstMock: vi.fn(),
  createMock: vi.fn(),
  compareMock: vi.fn(),
  hashMock: vi.fn(),
  signMock: vi.fn(),
  verifyMock: vi.fn(),
}));

vi.mock('@sc/lib/prisma.js', () => ({
  prisma: {
    user: {
      findFirst: findFirstMock,
      create: createMock,
    },
  },
}));

vi.mock('bcrypt', () => ({
  default: {
    compare: compareMock,
    hash: hashMock,
  },
}));

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: signMock,
    verify: verifyMock,
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

const createCaller = (
  signedCookies: Record<string, string> = {},
  userId: bigint | null = null
) => {
  const res = {
    cookie: vi.fn(),
    clearCookie: vi.fn(),
    status: vi.fn(),
  };

  const caller = userRouter.createCaller({
    userId,
    req: {
      signedCookies,
    },
    res,
  } as never);

  return { caller, res };
};

describe('userRouter.login', () => {
  it('returns session payload and sets signed httpOnly cookie for valid credentials', async () => {
    findFirstMock.mockResolvedValueOnce({
      id: 11n,
      email: 'valid@example.com',
      password: 'hashed-password',
    });
    compareMock.mockResolvedValueOnce(true);
    signMock.mockReturnValueOnce('signed-jwt-token');

    const { caller, res } = createCaller();
    const result = await caller.login({
      email: 'valid@example.com',
      password: 'correct-password',
    });

    expect(result).toEqual({ id: 11n });
    expect(findFirstMock).toHaveBeenCalledWith({
      where: {
        email: 'valid@example.com',
      },
    });
    expect(compareMock).toHaveBeenCalledWith(
      'correct-password',
      'hashed-password'
    );
    expect(signMock).toHaveBeenCalledWith({ id: 11n }, 'test-auth-secret');
    expect(res.cookie).toHaveBeenCalledWith(
      SESSION_TOKEN_COOKIE,
      'signed-jwt-token',
      {
        secure: true,
        sameSite: 'strict',
        signed: true,
        httpOnly: true,
      }
    );
  });

  it('throws UNAUTHORIZED when user does not exist', async () => {
    findFirstMock.mockResolvedValueOnce(null);

    const { caller, res } = createCaller();

    await expect(
      caller.login({
        email: 'missing@example.com',
        password: 'password',
      })
    ).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
      message: 'Invalid email or password',
    });

    expect(compareMock).not.toHaveBeenCalled();
    expect(signMock).not.toHaveBeenCalled();
    expect(res.cookie).not.toHaveBeenCalled();
  });

  it('throws UNAUTHORIZED when password comparison fails', async () => {
    findFirstMock.mockResolvedValueOnce({
      id: 12n,
      email: 'user@example.com',
      password: 'hashed-password',
    });
    compareMock.mockResolvedValueOnce(false);

    const { caller, res } = createCaller();

    await expect(
      caller.login({
        email: 'user@example.com',
        password: 'wrong-password',
      })
    ).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
      message: 'Invalid email or password',
    });

    expect(signMock).not.toHaveBeenCalled();
    expect(res.cookie).not.toHaveBeenCalled();
  });
});

describe('userRouter.signup', () => {
  it('creates a user with hashed password and sets CREATED status', async () => {
    findFirstMock.mockResolvedValueOnce(null);
    hashMock.mockResolvedValueOnce('hashed-password');
    createMock.mockResolvedValueOnce({
      id: 21n,
      email: 'new@example.com',
      password: 'hashed-password',
    });

    const { caller, res } = createCaller();

    await caller.signup({
      email: 'new@example.com',
      password: 'plain-password',
    });

    expect(findFirstMock).toHaveBeenCalledWith({
      where: {
        email: 'new@example.com',
      },
    });
    expect(hashMock).toHaveBeenCalledWith('plain-password', 10);
    expect(createMock).toHaveBeenCalledWith({
      data: {
        email: 'new@example.com',
        password: 'hashed-password',
      },
    });
    expect(res.status).toHaveBeenCalledWith(StatusCode.CREATED);
  });

  it('throws CONFLICT when email already exists', async () => {
    findFirstMock.mockResolvedValueOnce({
      id: 30n,
      email: 'existing@example.com',
      password: 'hash',
    });

    const { caller, res } = createCaller();

    await expect(
      caller.signup({
        email: 'existing@example.com',
        password: 'any-password',
      })
    ).rejects.toMatchObject({
      code: 'CONFLICT',
      message: 'User with the same email exists',
    });

    expect(hashMock).not.toHaveBeenCalled();
    expect(createMock).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});

describe('userRouter.authorized', () => {
  it('returns false when signed cookie is missing', async () => {
    const { caller } = createCaller();

    const result = await caller.authorized();

    expect(result).toBe(false);
    expect(verifyMock).not.toHaveBeenCalled();
  });

  it('returns true when token verification succeeds', async () => {
    verifyMock.mockReturnValueOnce({ id: 11n });

    const { caller } = createCaller({
      [SESSION_TOKEN_COOKIE]: 'valid-token',
    });

    const result = await caller.authorized();

    expect(result).toBe(true);
    expect(verifyMock).toHaveBeenCalledWith('valid-token', 'test-auth-secret');
  });

  it('returns false when token verification throws', async () => {
    verifyMock.mockImplementationOnce(() => {
      throw new Error('invalid token');
    });

    const { caller } = createCaller({
      [SESSION_TOKEN_COOKIE]: 'invalid-token',
    });

    const result = await caller.authorized();

    expect(result).toBe(false);
    expect(verifyMock).toHaveBeenCalledWith(
      'invalid-token',
      'test-auth-secret'
    );
  });
});

describe('userRouter.logout', () => {
  it('clears session cookie and sets OK status', async () => {
    const { caller, res } = createCaller({}, 99n);

    await caller.logout();

    expect(res.clearCookie).toHaveBeenCalledWith(SESSION_TOKEN_COOKIE, {
      secure: true,
      sameSite: 'strict',
      signed: true,
      httpOnly: true,
    });
    expect(res.status).toHaveBeenCalledWith(StatusCode.OK);
  });
});
