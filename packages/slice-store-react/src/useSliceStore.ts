import { useCallback, useRef, useSyncExternalStore } from 'react';
import type { Selector, SliceStore } from '@qlover/slice-store';

/**
 * Subscribe to a SliceStore with React.
 *
 * Uses `useSyncExternalStore` so subscription is concurrent-safe and avoids the
 * extra update timing issues of the older `useState` + `useEffect` pattern.
 *
 * Snapshot is the last value notified by the store (aligned with microtask
 * batching). Selectors may allocate new objects; caching is driven by
 * `store.observe`'s comparison, not by re-running the selector every render.
 */
export function useSliceStore<T, S = T>(
  store: SliceStore<T>,
  selector?: Selector<T, S>
): S {
  const selectorRef = useRef(selector);
  selectorRef.current = selector;

  const cacheRef = useRef<S>(
    selector ? selector(store.state) : (store.state as unknown as S)
  );

  // Keep cache in sync when the store instance switches.
  const storeRef = useRef(store);
  if (storeRef.current !== store) {
    storeRef.current = store;
    const currentSelector = selectorRef.current;
    cacheRef.current = currentSelector
      ? currentSelector(store.state)
      : (store.state as unknown as S);
  }

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const currentSelector = selectorRef.current;
      cacheRef.current = currentSelector
        ? currentSelector(store.state)
        : (store.state as unknown as S);

      return store.observe(
        (state) => {
          const sel = selectorRef.current;
          return sel ? sel(state) : (state as unknown as S);
        },
        (selected) => {
          cacheRef.current = selected;
          onStoreChange();
        }
      );
    },
    [store]
  );

  const getSnapshot = useCallback((): S => cacheRef.current, []);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
