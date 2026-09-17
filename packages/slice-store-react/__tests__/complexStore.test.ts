import { renderHook, act } from '@testing-library/react';
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

  public addItem = (item: {
    id: number;
    name: string;
    value: number;
  }): void => {
    this.emit({
      ...this.state,
      items: [...this.state.items, item],
      metadata: { lastUpdated: new Date().toISOString() }
    });
  };

  public updateItem = (
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

async function actEmit(run: () => void): Promise<void> {
  await act(async () => {
    run();
    await Promise.resolve();
  });
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

  test('should add new item', async () => {
    const complexStore = new ComplexStore();
    const { result } = renderHook(() => useSliceStore(complexStore));

    await actEmit(() => {
      complexStore.addItem({ id: 3, name: 'Item 3', value: 30 });
    });

    expect(result.current.items).toHaveLength(3);
    expect(result.current.items[2]).toEqual({
      id: 3,
      name: 'Item 3',
      value: 30
    });
  });

  test('should update existing item', async () => {
    const complexStore = new ComplexStore();
    const { result } = renderHook(() => useSliceStore(complexStore));

    await actEmit(() => {
      complexStore.updateItem(1, { name: 'Updated Item 1', value: 15 });
    });

    expect(result.current.items[0]).toEqual({
      id: 1,
      name: 'Updated Item 1',
      value: 15
    });
  });

  test('should use selector with complex data', async () => {
    const complexStore = new ComplexStore();
    const { result } = renderHook(() =>
      useSliceStore(complexStore, (state) =>
        state.items.map((item) => item.name)
      )
    );

    expect(result.current).toEqual(['Item 1', 'Item 2']);

    await actEmit(() => {
      complexStore.addItem({ id: 3, name: 'Item 3', value: 30 });
    });

    expect(result.current).toEqual(['Item 1', 'Item 2', 'Item 3']);
  });

  test('multiple components should react to complex state changes', async () => {
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

    await actEmit(() => {
      complexStore.addItem({ id: 3, name: 'Item 3', value: 30 });
    });

    expect(result1.current.items).toHaveLength(3);
    expect(result2.current).toBe(3);
    expect(result3.current).not.toBe(initialLastUpdated);

    await actEmit(() => {
      complexStore.updateItem(1, { name: 'Updated Item 1' });
    });

    expect(result1.current.items[0].name).toBe('Updated Item 1');
    expect(result2.current).toBe(3);
    expect(result3.current).not.toBe(initialLastUpdated);
  });

  test('multiple listeners should react to the same data changes', async () => {
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

    await actEmit(() => {
      complexStore.updateItem(1, { name: 'Updated Item 1' });
    });

    expect(result1.current).toBe('Updated Item 1');
    expect(result2.current).toBe('Updated Item 1');
    expect(result3.current).toBe('Updated Item 1');

    await actEmit(() => {
      complexStore.updateItem(1, { name: 'Changed Again' });
    });

    expect(result1.current).toBe('Changed Again');
    expect(result2.current).toBe('Changed Again');
    expect(result3.current).toBe('Changed Again');
  });

  test('should handle empty array and undefined values', async () => {
    class EmptyStore extends SliceStore<{
      items: Array<{ id: number; name: string }>;
      optionalField?: string;
    }> {
      constructor() {
        super(() => ({ items: [] }));
      }

      public addItem = (item: { id: number; name: string }) => {
        this.emit({ ...this.state, items: [...this.state.items, item] });
      };

      public setOptionalField = (value?: string) => {
        this.emit({ ...this.state, optionalField: value });
      };
    }

    const emptyStore = new EmptyStore();
    const { result } = renderHook(() => useSliceStore(emptyStore));

    expect(result.current.items).toHaveLength(0);
    expect(result.current.optionalField).toBeUndefined();

    await actEmit(() => {
      emptyStore.addItem({ id: 1, name: 'First Item' });
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].name).toBe('First Item');

    await actEmit(() => {
      emptyStore.setOptionalField('Some Value');
    });

    expect(result.current.optionalField).toBe('Some Value');

    await actEmit(() => {
      emptyStore.setOptionalField(undefined);
    });

    expect(result.current.optionalField).toBeUndefined();
  });
});
