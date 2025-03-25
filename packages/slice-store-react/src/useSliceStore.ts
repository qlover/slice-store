import { type Listener, SliceStore } from '@qlover/slice-store';
import { useState, useEffect } from 'react';

export function useSliceStore<T, S = T>(
  store: SliceStore<T>,
  selector?: (state: T) => S
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
