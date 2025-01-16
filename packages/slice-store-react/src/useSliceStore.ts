import { SliceStore } from '@qlover/slice-store';
import { useState, useEffect } from 'react';

export function useSliceStore<T, S = T>(
  store: SliceStore<T>,
  selector?: (state: T) => S
): S {
  const [storeState, setStoreState] = useState<S>(
    selector ? selector(store.state) : (store.state as unknown as S)
  );

  useEffect(() => {
    const unsubscribe = store.observe((state: T) => {
      const newState = selector ? selector(state) : (state as unknown as S);
      setStoreState(newState);
    });

    return () => {
      unsubscribe();
    };
  }, [store, selector]);

  return storeState;
}
