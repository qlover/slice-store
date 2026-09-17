# @qlover/slice-store-react

[简体中文](./README.md) | English

> Chinese is the default for this package. Prefer [README.md](./README.md).

React bindings for `@qlover/slice-store`. `useSliceStore` is built on `useSyncExternalStore` and aligns with the store’s microtask batching.

## Features

- Matches React 18+ external store subscription
- Selectors can skip re-renders when the selected value is unchanged
- Multiple components can share one store
- TypeScript-friendly

## Install

```bash
npm install @qlover/slice-store @qlover/slice-store-react
# or
pnpm add @qlover/slice-store @qlover/slice-store-react
```

Peers: `react` / `react-dom` >= 18.

## Basic usage

```tsx
import { SliceStore } from '@qlover/slice-store';
import { useSliceStore } from '@qlover/slice-store-react';

type Value = { count: number };

class AppStore extends SliceStore<Value> {
  constructor() {
    super(() => ({ count: 1 }));
  }

  inc = (): void => {
    this.emit({ count: this.state.count + 1 });
  };
}

const appStore = new AppStore();

export function App() {
  const { count } = useSliceStore(appStore);

  return (
    <button type="button" onClick={appStore.inc}>
      count is {count}
    </button>
  );
}
```

## Selectors

Subscribe to a slice; unchanged selected values skip updates:

```tsx
const age = useSliceStore(userStore, (state) => state.age);
```

## With emit batching

Multiple `emit` calls in one event handler notify once, so React typically re-renders once:

```tsx
class ProfileStore extends SliceStore<{ name: string; age: number }> {
  updateBoth = (name: string, age: number): void => {
    this.emit({ ...this.state, name });
    this.emit({ ...this.state, age });
  };
}
```

Prefer `emit((prev) => ...)` for concurrent async writes. See [slice-store docs](../slice-store/README_EN.md).

## Shared store across components

```tsx
function CounterDisplay() {
  const { count } = useSliceStore(counterStore);
  return <div>Count: {count}</div>;
}

function IncrementButton() {
  useSliceStore(counterStore);
  return (
    <button type="button" onClick={counterStore.increment}>
      Increment
    </button>
  );
}
```

## Playground

From the monorepo root:

```bash
pnpm dev:playground
```

See [examples/playground](../../examples/playground/README.md).

## License

ISC
