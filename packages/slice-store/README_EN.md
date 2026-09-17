# @qlover/slice-store

[简体中文](./README.md) | English

> Chinese is the default for this package. Prefer [README.md](./README.md).

A lightweight slice state store: encapsulate state in a class, update with `emit`, subscribe with `observe`.

## Features

- Simple, TypeScript-friendly API
- Objects, arrays, numbers, and more
- Consecutive sync `emit` calls are merged into one microtask notification by default
- Value / updater `emit`, plus `flush`
- Multiple observers and selectors on the same store
- Works across environments (browser, Node, etc.)

## Install

```bash
npm install @qlover/slice-store
# or
pnpm add @qlover/slice-store
```

## Basic usage

```typescript
import { SliceStore } from '@qlover/slice-store';

type Value = { count: number };

class AppStore extends SliceStore<Value[]> {
  constructor() {
    super(() => [{ count: 1 }]);
  }

  incAll(): void {
    this.emit(this.state.map((val) => ({ count: val.count + 1 })));
  }
}

const appStore = new AppStore();
appStore.incAll();
console.log(appStore.state[0].count); // => 2
```

## emit batching (microtask)

When you call `emit` multiple times in the same synchronous turn:

- **state updates immediately** to the final value
- **observers are notified once** by default (deferred to a microtask)

You can emit several times inside a business method without wrapping in `batch()`:

```typescript
updateProfile(name: string, age: number): void {
  this.emit({ ...this.state, name });
  this.emit({ ...this.state, age });
  // subscribers notified once with final name + age
}
```

### updater (preferred for concurrent / async writes)

When parallel async tasks update different fields, use an updater so each write commits against the latest state:

```typescript
store.emit((s) => ({ ...s, a: 1 }));
store.emit((s) => ({ ...s, b: 2 }));
// final { a: 1, b: 2 }
```

### flush immediately

For tests or sync side effects:

```typescript
store.emit({ ...store.state, ready: true }, { flush: true });
// or
store.emit({ ...store.state, ready: true });
store.flush();
```

Updates across `await` are separate batches and notify separately (e.g. `loading: true` then the result). That is intentional.

## Multiple observers

```typescript
import { SliceStore } from '@qlover/slice-store';

class CounterStore extends SliceStore<number> {
  constructor() {
    super(() => 0);
  }

  increment(): void {
    this.emit(this.state + 1);
  }
}

const counterStore = new CounterStore();

counterStore.observe((state) => {
  console.log('Observer 1:', state);
});

counterStore.observe((state) => {
  console.log('Observer 2:', state);
});

counterStore.increment();
```

Selectors notify only when the selected value changes:

```typescript
store.observe(
  (s) => s.count,
  (count) => console.log('count =', count)
);
```

## React

Use [`@qlover/slice-store-react`](../slice-store-react/README.md) (`useSliceStore`).

Playground from the monorepo root:

```bash
pnpm dev:playground
```

## License

ISC
