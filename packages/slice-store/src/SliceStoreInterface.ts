import type { Listener, Selector } from './Observer';

export interface SliceStoreInterface<T> {
  readonly state: T;

  emit(state: T): void;

  observe<K = T>(selector: Selector<T, K>): () => void;
  observe<K = T>(selector: Selector<T, K>, listener: Listener<K>): () => void;

  reset(): void;

  clear(): void;
}
