import { UnparsedDefaultId, defaultId } from '@shared/zod/common';

// JS support for bigint is not great :)
// CockroachDB uses bigint for primary keys, so we need to be able to parse them
// Due to JS limitations they are passed as strings between client and server

export const parseBigInt = (value: UnparsedDefaultId) => defaultId.parse(value);

export const compareEqual = (a: UnparsedDefaultId, b: UnparsedDefaultId) =>
  parseBigInt(a) === parseBigInt(b);
export const compareLessThan = (a: UnparsedDefaultId, b: UnparsedDefaultId) =>
  parseBigInt(a) < parseBigInt(b);
