import type { SessionSchema } from '@tapiv1/trpc/shared-validators';

interface StorageTypeValue {
  user?: SessionSchema;
}

export enum StorageType {
  USER = 'user',
}

const hasStorage = () => typeof window !== 'undefined' && window.localStorage;

export const setItem = <T extends keyof StorageTypeValue>(
  type: StorageType,
  value: StorageTypeValue[T]
) => {
  if (!hasStorage()) return;

  if (!value) throw new Error("Can't set empty value");

  localStorage.setItem(type, JSON.stringify(value));
};

export const removeItem = (type: StorageType) => {
  if (!hasStorage()) return;

  localStorage.removeItem(type);
};

export const getItem = <T extends keyof StorageTypeValue>(
  type: T
): StorageTypeValue[T] => {
  if (!hasStorage()) return;

  const storedValue = localStorage.getItem(type);
  if (!storedValue) return;

  return JSON.parse(storedValue) as StorageTypeValue[T];
};
