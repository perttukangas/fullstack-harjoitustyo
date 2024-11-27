import type { SessionSchema } from '@tapiv1/trpc/shared-validators';

interface StorageTypeValue {
  user?: SessionSchema;
  csrf?: string;
}

export enum StorageType {
  USER = 'user',
  CSRF = 'csrf',
}

const hasStorage = () => typeof window !== 'undefined' && window.sessionStorage;

export const setItem = <T extends keyof StorageTypeValue>(
  type: StorageType,
  value: StorageTypeValue[T]
) => {
  if (!hasStorage()) return;

  if (!value) throw new Error("Can't set empty value");

  sessionStorage.setItem(type, JSON.stringify(value));
};

export const removeItem = (type: StorageType) => {
  if (!hasStorage()) return;

  sessionStorage.removeItem(type);
};

export const getItem = <T extends keyof StorageTypeValue>(
  type: T
): StorageTypeValue[T] => {
  if (!hasStorage()) return;

  const storedValue = sessionStorage.getItem(type);
  if (!storedValue) return;

  return JSON.parse(storedValue) as StorageTypeValue[T];
};
