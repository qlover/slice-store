import type { Listener, Selector, Unsubscribe } from './Observer';

export interface ObserveStateInterface<T> {
  getState(): T;

  observe<K = T>(
    selectorOrListener: Selector<T, K> | Listener<T>,
    listener?: Listener<K>
  ): Unsubscribe;
}

export interface SliceStoreInterface<T> extends ObserveStateInterface<T> {
  set(state: T): void;

  reset(): void;

  clear(): void;
}
