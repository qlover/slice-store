# slice-store-react

## Introduction

slice-store helps you write consistent, testable JavaScript applications that run in different environments (client, server, and native).

## Features

- Simple and easy-to-use API
- Support for complex data structures
- Efficient state updates
- Selector functionality
- Comprehensive type support

## Installation

```bash
npm install @qlover/slice-store-react
# or use yarn
yarn add @qlover/slice-store-react
```

## Usage Examples

### Basic Usage

```tsx
import { SliceStore } from '@qlover/slice-store';
import { useSliceStore } from '@qlover/slice-store-react';
import './App.css';

type Value = {
  count: number;
};
class AppStore extends SliceStore<Value> {
  constructor() {
    super(() => ({ count: 1 }));
  }

  inc = () => {
    this.emit({ count: this.state.count + 1 });
  };
}

const appStore = new AppStore();

function App() {
  const { count } = useSliceStore(appStore);

  return (
    <>
      <h1>React Slice Store</h1>
      <div className="card">
        <button onClick={appStore.inc}>count is {count}</button>
      </div>
    </>
  );
}

export default App;
```

### Using Selectors

```tsx
import { SliceStore } from '@qlover/slice-store';
import { useSliceStore } from '@qlover/slice-store-react';

type User = {
  id: number;
  name: string;
  age: number;
};

class UserStore extends SliceStore<User> {
  constructor() {
    super(() => ({ id: 1, name: 'John Doe', age: 30 }));
  }

  updateAge = (newAge: number) => {
    this.emit({ ...this.state, age: newAge });
  };
}

const userStore = new UserStore();

function UserAge() {
  const age = useSliceStore(userStore, state => state.age);

  return <div>User age: {age}</div>;
}

function UserInfo() {
  const { name, age } = useSliceStore(userStore);

  return (
    <div>
      <div>Name: {name}</div>
      <div>Age: {age}</div>
      <button onClick={() => userStore.updateAge(age + 1)}>Increment Age</button>
    </div>
  );
}
```

### Multiple Components Listening to the Same State

```tsx
import { SliceStore } from '@qlover/slice-store';
import { useSliceStore } from '@qlover/slice-store-react';

type CounterState = { count: number };

class CounterStore extends SliceStore<CounterState> {
  constructor() {
    super(() => ({ count: 0 }));
  }

  increment = () => {
    this.emit({ count: this.state.count + 1 });
  };
}

const counterStore = new CounterStore();

function CounterDisplay() {
  const { count } = useSliceStore(counterStore);
  return <div>Count: {count}</div>;
}

function IncrementButton() {
  useSliceStore(counterStore); // Listen to state changes to trigger re-render
  return <button onClick={counterStore.increment}>Increment</button>;
}

function App() {
  return (
    <div>
      <CounterDisplay />
      <CounterDisplay /> {/* Two components displaying and updating the count simultaneously */}
      <IncrementButton />
    </div>
  );
}
```

These examples demonstrate the flexibility and power of @qlover/slice-store-react, including basic usage, selector usage, and how multiple components can share and respond to the same state.

## Testing

Our test suite covers the following aspects:

- Basic functionality tests
- Handling of complex data structures
- Multiple components simultaneously listening to state changes
- Selector functionality usage
- Edge case handling (empty arrays, undefined values, etc.)

## Contributing

We welcome issues and pull requests to help improve this project.

## License

ISC