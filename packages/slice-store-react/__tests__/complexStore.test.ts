import { renderHook, act } from '@testing-library/react-hooks';
import { useSliceStore } from '../src';
import { SliceStore } from '@qlover/slice-store';

class ComplexStore extends SliceStore<{
  items: Array<{ id: number; name: string; value: number }>;
  metadata: { lastUpdated: string };
}> {
  constructor() {
    super(() => ({
      items: [
        { id: 1, name: 'Item 1', value: 10 },
        { id: 2, name: 'Item 2', value: 20 }
      ],
      metadata: { lastUpdated: new Date().toISOString() }
    }));
  }

  addItem = (item: { id: number; name: string; value: number }): void => {
    this.emit({
      ...this.state,
      items: [...this.state.items, item],
      metadata: { lastUpdated: new Date().toISOString() }
    });
  };

  updateItem = (
    id: number,
    updates: Partial<{ name: string; value: number }>
  ): void => {
    this.emit({
      ...this.state,
      items: this.state.items.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
      metadata: { lastUpdated: new Date().toISOString() }
    });
  };
}

describe('ComplexStore', () => {
  test('should initialize with correct data', () => {
    const complexStore = new ComplexStore();
    const { result } = renderHook(() => useSliceStore(complexStore));

    expect(result.current.items).toHaveLength(2);
    expect(result.current.items[0]).toEqual({
      id: 1,
      name: 'Item 1',
      value: 10
    });
    expect(result.current.metadata.lastUpdated).toBeDefined();
  });

  test('should add new item', () => {
    const complexStore = new ComplexStore();
    const { result } = renderHook(() => useSliceStore(complexStore));

    act(() => {
      complexStore.addItem({ id: 3, name: 'Item 3', value: 30 });
    });

    expect(result.current.items).toHaveLength(3);
    expect(result.current.items[2]).toEqual({
      id: 3,
      name: 'Item 3',
      value: 30
    });
  });

  test('should update existing item', () => {
    const complexStore = new ComplexStore();
    const { result } = renderHook(() => useSliceStore(complexStore));

    act(() => {
      complexStore.updateItem(1, { name: 'Updated Item 1', value: 15 });
    });

    expect(result.current.items[0]).toEqual({
      id: 1,
      name: 'Updated Item 1',
      value: 15
    });
  });

  test('should use selector with complex data', () => {
    const complexStore = new ComplexStore();
    const { result } = renderHook(() =>
      useSliceStore(complexStore, (state) =>
        state.items.map((item) => item.name)
      )
    );

    expect(result.current).toEqual(['Item 1', 'Item 2']);

    act(() => {
      complexStore.addItem({ id: 3, name: 'Item 3', value: 30 });
    });

    expect(result.current).toEqual(['Item 1', 'Item 2', 'Item 3']);
  });

  // 新增测试：多个组件同时监听复杂状态的变化
  test('multiple components should react to complex state changes', () => {
    const complexStore = new ComplexStore();
    const { result: result1 } = renderHook(() => useSliceStore(complexStore));
    const { result: result2 } = renderHook(() =>
      useSliceStore(complexStore, (state) => state.items.length)
    );
    const { result: result3 } = renderHook(() =>
      useSliceStore(complexStore, (state) => state.metadata.lastUpdated)
    );

    expect(result1.current.items).toHaveLength(2);
    expect(result2.current).toBe(2);
    expect(result3.current).toBeDefined();

    const initialLastUpdated = result3.current;

    act(() => {
      complexStore.addItem({ id: 3, name: 'Item 3', value: 30 });
    });

    expect(result1.current.items).toHaveLength(3);
    expect(result2.current).toBe(3);
    expect(result3.current).not.toBe(initialLastUpdated);

    act(() => {
      complexStore.updateItem(1, { name: 'Updated Item 1' });
    });

    expect(result1.current.items[0].name).toBe('Updated Item 1');
    expect(result2.current).toBe(3); // 数量没有变化
    expect(result3.current).not.toBe(initialLastUpdated);
  });

  // 新增测试：多次监听同一个数据
  test('multiple listeners should react to the same data changes', () => {
    const complexStore = new ComplexStore();
    const { result: result1 } = renderHook(() =>
      useSliceStore(complexStore, (state) => state.items[0].name)
    );
    const { result: result2 } = renderHook(() =>
      useSliceStore(complexStore, (state) => state.items[0].name)
    );
    const { result: result3 } = renderHook(() =>
      useSliceStore(complexStore, (state) => state.items[0].name)
    );

    expect(result1.current).toBe('Item 1');
    expect(result2.current).toBe('Item 1');
    expect(result3.current).toBe('Item 1');

    act(() => {
      complexStore.updateItem(1, { name: 'Updated Item 1' });
    });

    expect(result1.current).toBe('Updated Item 1');
    expect(result2.current).toBe('Updated Item 1');
    expect(result3.current).toBe('Updated Item 1');

    act(() => {
      complexStore.updateItem(1, { name: 'Changed Again' });
    });

    expect(result1.current).toBe('Changed Again');
    expect(result2.current).toBe('Changed Again');
    expect(result3.current).toBe('Changed Again');
  });

  // 新增测试：处理空数组和未定义的情况
  test('should handle empty array and undefined values', () => {
    class EmptyStore extends SliceStore<{
      items: Array<{ id: number; name: string }>;
      optionalField?: string;
    }> {
      constructor() {
        super(() => ({ items: [] }));
      }

      addItem = (item: { id: number; name: string }) => {
        this.emit({ ...this.state, items: [...this.state.items, item] });
      };

      setOptionalField = (value?: string) => {
        this.emit({ ...this.state, optionalField: value });
      };
    }

    const emptyStore = new EmptyStore();
    const { result } = renderHook(() => useSliceStore(emptyStore));

    expect(result.current.items).toHaveLength(0);
    expect(result.current.optionalField).toBeUndefined();

    act(() => {
      emptyStore.addItem({ id: 1, name: 'First Item' });
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].name).toBe('First Item');

    act(() => {
      emptyStore.setOptionalField('Some Value');
    });

    expect(result.current.optionalField).toBe('Some Value');

    act(() => {
      emptyStore.setOptionalField(undefined);
    });

    expect(result.current.optionalField).toBeUndefined();
  });
});
