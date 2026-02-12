import type { Listener, Selector } from './Observer';

export interface SliceStoreInterface<T> {
  getState(): T;

  set(state: T): void;

  reset(): void;

  observe<K = T>(
    selectorOrListener: Selector<T, K> | Listener<T>,
    listener?: Listener<K>
  ): () => void;
  clear(): void;
}
