import { ComponentType, LazyExoticComponent, lazy } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const lazyPrefetch = <T extends ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>
): LazyExoticComponent<T> & { prefetch: () => Promise<{ default: T }> } => {
  const factory = async () => {
    return await componentImport();
  };

  const Component = lazy(factory) as LazyExoticComponent<T> & {
    prefetch: () => Promise<{ default: T }>;
  };

  Component.prefetch = factory;

  return Component;
};
