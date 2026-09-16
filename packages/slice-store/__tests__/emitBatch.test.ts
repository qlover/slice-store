import { SliceStore } from '../src';

type AppState = {
  a: number;
  b: number;
  loading: boolean;
  data: string | null;
};

function createStore(initial?: Partial<AppState>): SliceStore<AppState> {
  return new SliceStore(() => ({
    a: 0,
    b: 0,
    loading: false,
    data: null,
    ...initial
  }));
}

function delay(ms = 0): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('emit batching and updater', () => {
  test('state updates synchronously before notify', () => {
    const store = createStore();
    store.emit({ ...store.state, a: 1 });
    expect(store.state.a).toBe(1);
  });

  test('sync consecutive value emits notify once with final state', async () => {
    const store = createStore();
    const listener = vi.fn();
    store.observe(listener);

    store.emit({ ...store.state, a: 1 });
    store.emit({ ...store.state, b: 2 });

    expect(listener).not.toHaveBeenCalled();
    expect(store.state).toEqual({ a: 1, b: 2, loading: false, data: null });

    await Promise.resolve();

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith({
      a: 1,
      b: 2,
      loading: false,
      data: null
    });
  });

  test('updater emits apply against latest state and notify once', async () => {
    const store = createStore();
    const listener = vi.fn();
    store.observe(listener);

    store.emit((s) => ({ ...s, a: 1 }));
    store.emit((s) => ({ ...s, b: 2 }));

    await Promise.resolve();

    expect(store.state).toEqual({ a: 1, b: 2, loading: false, data: null });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  test('emit with flush notifies immediately', () => {
    const store = createStore();
    const listener = vi.fn();
    store.observe(listener);

    store.emit({ ...store.state, a: 1 }, { flush: true });

    expect(listener).toHaveBeenCalledTimes(1);
    expect(store.state.a).toBe(1);
  });

  test('flush() drains a pending microtask batch', () => {
    const store = createStore();
    const listener = vi.fn();
    store.observe(listener);

    store.emit({ ...store.state, a: 1 });
    store.emit({ ...store.state, b: 2 });
    expect(listener).not.toHaveBeenCalled();

    store.flush();
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith({
      a: 1,
      b: 2,
      loading: false,
      data: null
    });
  });

  test('flush() is a no-op when nothing is pending', () => {
    const store = createStore();
    const listener = vi.fn();
    store.observe(listener);

    store.flush();
    expect(listener).not.toHaveBeenCalled();
  });

  test('flush emit after pending batch notifies once with batch old state', () => {
    const store = createStore({ a: 10, b: 20 });
    const listener = vi.fn();
    store.observe(listener);

    store.emit({ ...store.state, a: 1 });
    store.emit({ ...store.state, b: 2 }, { flush: true });

    expect(listener).toHaveBeenCalledTimes(1);
    expect(store.state).toEqual({ a: 1, b: 2, loading: false, data: null });
  });

  test('async updates across await notify separately', async () => {
    const store = createStore();
    const listener = vi.fn();
    store.observe(listener);

    store.emit((s) => ({ ...s, loading: true }));
    await Promise.resolve();
    expect(listener).toHaveBeenCalledTimes(1);
    expect(store.state.loading).toBe(true);

    store.emit((s) => ({ ...s, data: 'ok', loading: false }));
    await Promise.resolve();
    expect(listener).toHaveBeenCalledTimes(2);
    expect(store.state).toMatchObject({ data: 'ok', loading: false });
  });

  test('parallel plain emits can overwrite each other', async () => {
    const store = createStore();

    await Promise.all([
      (async () => {
        const snapshot = store.state;
        await delay(5);
        store.emit({ ...snapshot, a: 1 });
      })(),
      (async () => {
        const snapshot = store.state;
        await delay(5);
        store.emit({ ...snapshot, b: 2 });
      })()
    ]);
    store.flush();

    // Last write wins — one of the fields is lost
    expect(store.state.a === 1 && store.state.b === 2).toBe(false);
  });

  test('parallel updater emits preserve both fields', async () => {
    const store = createStore();

    await Promise.all([
      (async () => {
        await delay(5);
        store.emit((s) => ({ ...s, a: 1 }));
      })(),
      (async () => {
        await delay(5);
        store.emit((s) => ({ ...s, b: 2 }));
      })()
    ]);
    store.flush();

    expect(store.state).toMatchObject({ a: 1, b: 2 });
  });

  test('selector observers use batch old state for comparison', async () => {
    const store = createStore({ a: 0, b: 0 });
    const onA = vi.fn();
    const onB = vi.fn();

    store.observe((s) => s.a, onA);
    store.observe((s) => s.b, onB);

    store.emit((s) => ({ ...s, a: 1 }));
    store.emit((s) => ({ ...s, b: 2 }));
    await Promise.resolve();

    expect(onA).toHaveBeenCalledTimes(1);
    expect(onA).toHaveBeenCalledWith(1);
    expect(onB).toHaveBeenCalledTimes(1);
    expect(onB).toHaveBeenCalledWith(2);
  });

  test('selector does not fire when selected value is unchanged in a batch', async () => {
    const store = createStore({ a: 1, b: 0 });
    const onA = vi.fn();
    store.observe((s) => s.a, onA);

    store.emit((s) => ({ ...s, b: 1 }));
    store.emit((s) => ({ ...s, b: 2 }));
    await Promise.resolve();

    expect(onA).not.toHaveBeenCalled();
    expect(store.state.b).toBe(2);
  });
});
