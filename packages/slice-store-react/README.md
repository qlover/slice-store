# @qlover/slice-store-react

简体中文 | [English](./README_EN.md)

`@qlover/slice-store` 的 React 绑定。`useSliceStore` 基于 `useSyncExternalStore`，与 store 的 microtask 批处理对齐。

## 特性

- 与 React 18+ 外部 store 订阅模型一致
- 支持 selector，未选中字段变化时可跳过渲染
- 同一 store 可被多个组件订阅
- TypeScript 友好

## 安装

```bash
npm install @qlover/slice-store @qlover/slice-store-react
# 或
pnpm add @qlover/slice-store @qlover/slice-store-react
```

Peer：`react` / `react-dom` >= 18。

## 基本用法

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

## 选择器

只订阅需要的字段；选中值未变时不会触发该组件更新：

```tsx
const age = useSliceStore(userStore, (state) => state.age);
```

## 与 emit 批处理的关系

同一事件处理函数里多次 `emit` 时，store 只通知一次，React 通常也只重渲染一次：

```tsx
class ProfileStore extends SliceStore<{ name: string; age: number }> {
  updateBoth = (name: string, age: number): void => {
    this.emit({ ...this.state, name });
    this.emit({ ...this.state, age });
  };
}
```

并发异步请优先 `emit((prev) => ...)`，详见 [slice-store 文档](../slice-store/README.md)。

## 多个组件共享同一 store

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

## 本地示例

在 monorepo 根目录：

```bash
pnpm dev:playground
```

示例台包含计数器、多次 emit 演示，以及 emit 场景面板。说明见 [examples/playground](../../examples/playground/README.md)。

## 许可证

ISC
