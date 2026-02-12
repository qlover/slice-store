import { type Listener } from '@qlover/slice-store';
import { useState, useEffect } from 'react';
import type { Selector, SliceStore } from '@qlover/slice-store';

export function useSliceStore<T, S = T>(
  store: SliceStore<T>,
  selector?: Selector<T, S>
): S {
  const [storeState, setStoreState] = useState<S>(
    selector ? selector(store.state) : (store.state as unknown as S)
  );

  useEffect(() => {
    const unsubscribe = selector
      ? store.observe(selector, setStoreState)
      : store.observe(setStoreState as unknown as Listener<T>);

    return () => {
      unsubscribe();
    };
  }, [store, selector]);

  return storeState;
}
