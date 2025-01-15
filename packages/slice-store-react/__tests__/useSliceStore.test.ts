import { renderHook, act } from '@testing-library/react-hooks';
import { useSliceStore } from '../src/useSliceStore';
import { SliceStore } from '@qlover/slice-store';

class CounterStore extends SliceStore<{
  count: number;
  name: string;
}> {
  constructor(init = 1) {
    super(() => ({ count: init, name: 'Counter' }));
  }

  increment = () => {
    this.emit({ ...this.state, count: this.state.count + 1 });
  };

  decrement = () => {
    this.emit({ ...this.state, count: this.state.count - 1 });
  };

  changeName = (newName: string) => {
    this.emit({ ...this.state, name: newName });
  };
}

// 原有的测试保持不变
test('should use counter', () => {
  const counterStore = new CounterStore(1);
  const { result } = renderHook(() => useSliceStore(counterStore));

  expect(result.current.count).toBe(1);

  act(() => {
    counterStore.increment();
  });

  expect(result.current.count).toBe(2);

  act(() => {
    counterStore.decrement();
  });

  expect(result.current.count).toBe(1);
});

test('should initialize counter with custom initial value', () => {
  const counterStore = new CounterStore(5);
  const { result } = renderHook(() => useSliceStore(counterStore));

  expect(result.current.count).toBe(5);
});

// 新增测试：多个组件同时监听状态变化
test('multiple components should react to state changes', () => {
  const counterStore = new CounterStore(1);
  const { result: result1 } = renderHook(() => useSliceStore(counterStore));
  const { result: result2 } = renderHook(() => useSliceStore(counterStore));

  expect(result1.current.count).toBe(1);
  expect(result2.current.count).toBe(1);

  act(() => {
    counterStore.increment();
  });

  expect(result1.current.count).toBe(2);
  expect(result2.current.count).toBe(2);
});

// 新增测试：使用 selector 监听特定状态变化
test('should use selector to listen to specific state changes', () => {
  const counterStore = new CounterStore(1);
  const { result } = renderHook(() =>
    useSliceStore(counterStore, (state) => state.name)
  );

  expect(result.current).toBe('Counter');

  act(() => {
    counterStore.changeName('New Counter');
  });

  expect(result.current).toBe('New Counter');

  act(() => {
    counterStore.increment();
  });

  // 验证 selector 只关注 name 的变化，而忽略 count 的变化
  expect(result.current).toBe('New Counter');
});
