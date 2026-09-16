import { renderHook, act } from '@testing-library/react';
import { useSliceStore } from '../src/useSliceStore';
import { SliceStore } from '@qlover/slice-store';

class CounterStore extends SliceStore<{
  count: number;
  name: string;
}> {
  constructor(init = 1) {
    super(() => ({ count: init, name: 'Counter' }));
  }

  increment = (): void => {
    this.emit({ ...this.state, count: this.state.count + 1 });
  };

  decrement = (): void => {
    this.emit({ ...this.state, count: this.state.count - 1 });
  };

  changeName = (newName: string): void => {
    this.emit({ ...this.state, name: newName });
  };
}

/** Flush SliceStore microtask notify inside React act */
async function actEmit(run: () => void): Promise<void> {
  await act(async () => {
    run();
    await Promise.resolve();
  });
}

test('should use counter', async () => {
  const counterStore = new CounterStore(1);
  const { result } = renderHook(() => useSliceStore(counterStore));

  expect(result.current.count).toBe(1);

  await actEmit(() => {
    counterStore.increment();
  });

  expect(result.current.count).toBe(2);

  await actEmit(() => {
    counterStore.decrement();
  });

  expect(result.current.count).toBe(1);
});

test('should initialize counter with custom initial value', () => {
  const counterStore = new CounterStore(5);
  const { result } = renderHook(() => useSliceStore(counterStore));

  expect(result.current.count).toBe(5);
});

test('multiple components should react to state changes', async () => {
  const counterStore = new CounterStore(1);
  const { result: result1 } = renderHook(() => useSliceStore(counterStore));
  const { result: result2 } = renderHook(() => useSliceStore(counterStore));

  expect(result1.current.count).toBe(1);
  expect(result2.current.count).toBe(1);

  await actEmit(() => {
    counterStore.increment();
  });

  expect(result1.current.count).toBe(2);
  expect(result2.current.count).toBe(2);
});

test('should use selector to listen to specific state changes', async () => {
  const counterStore = new CounterStore(1);
  const { result } = renderHook(() =>
    useSliceStore(counterStore, (state) => state.name)
  );

  expect(result.current).toBe('Counter');

  await actEmit(() => {
    counterStore.changeName('New Counter');
  });

  expect(result.current).toBe('New Counter');

  await actEmit(() => {
    counterStore.increment();
  });

  expect(result.current).toBe('New Counter');
});
