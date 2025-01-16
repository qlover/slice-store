# slice-store

## Introduction

slice-store is a powerful state management library that helps you write JavaScript applications with consistent behavior, running in different environments (client, server, and native), and easy to test. It provides a simple and effective way to manage and update your application's state.

## Features

- Simple and easy-to-use API
- Support for various data types (objects, arrays, numbers, etc.)
- Observable state updates
- Support for binding multiple event handlers to the same state
- Type-safe (using TypeScript)
- Cross-platform compatibility

## Installation

```bash
npm install @qlover/slice-store
# or use yarn
yarn add @qlover/slice-store
```

## Basic Usage Example

```typescript
type Value = {
  count: number;
};
class AppStore extends SliceStore<Value[]> {
  constructor() {
    super(() => [{ count: 1 }]);
  }
  incAll() {
    const newState = this.state.map((val) => ({
      count: val.count + 1
    }));
    this.emit(newState);
  }
}

const appStore = new AppStore();

appStore.incAll();
console.log(appStore.state[0].count); //=> 2

appStore.incAll();
console.log(appStore.state[0].count); //=> 3
```

## Multiple Observers Example

slice-store now supports binding multiple event handlers to the same state. This allows you to respond more flexibly to state changes:

```typescript
import { SliceStore } from '@qlover/slice-store';

class CounterStore extends SliceStore<number> {
  constructor() {
    super(() => 0);
  }

  increment() {
    this.emit(this.state + 1);
  }
}

const counterStore = new CounterStore();

// Bind multiple observers
counterStore.subscribe((state) => {
  console.log('Observer 1:', state);
});

counterStore.subscribe((state) => {
  console.log('Observer 2:', state);
});

counterStore.increment();
// Output:
// Observer 1: 1
// Observer 2: 1

counterStore.increment();
// Output:
// Observer 1: 2
// Observer 2: 2
```

This example demonstrates how to bind multiple observers to the same state, with each observer being called when the state changes.