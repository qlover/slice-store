# @qlover/slice-store

简体中文 | [English](./README_EN.md)

轻量级状态切片仓库：用类封装状态，通过 `emit` 更新，通过 `observe` 订阅。

## 特性

- API 简单，TypeScript 友好
- 支持对象、数组、数字等多种状态类型
- 默认同步多次 `emit` 合并为一次 microtask 通知
- 支持 value / updater 两种 `emit`，以及 `flush`
- 同一状态可绑定多个观察者与 selector
- 跨环境可用（浏览器、Node 等）

## 安装

```bash
npm install @qlover/slice-store
# 或
pnpm add @qlover/slice-store
```

## 基本用法

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

## emit 批处理（microtask）

同一同步调用栈里连续多次 `emit` 时：

- **state 立刻更新**为最终值
- **观察者默认只通知一次**（排到 microtask）

业务方法里可以自然地多次 `emit`，不必再包一层 `batch()`：

```typescript
updateProfile(name: string, age: number): void {
  this.emit({ ...this.state, name });
  this.emit({ ...this.state, age });
  // 订阅方只收到一次通知，状态为最终 name + age
}
```

### updater（推荐用于并发/异步）

多个异步任务同时改不同字段时，用 updater 基于最新 state 提交，避免快照覆盖：

```typescript
store.emit((s) => ({ ...s, a: 1 }));
store.emit((s) => ({ ...s, b: 2 }));
// 最终 { a: 1, b: 2 }
```

### 立刻通知

测试或必须在同步栈内执行副作用时：

```typescript
store.emit({ ...store.state, ready: true }, { flush: true });
// 或
store.emit({ ...store.state, ready: true });
store.flush();
```

跨 `await` 的更新属于不同批次，会分别通知（例如先 `loading: true`，再写入结果）——这是预期行为。

## 多观察者

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
  console.log('观察者 1:', state);
});

counterStore.observe((state) => {
  console.log('观察者 2:', state);
});

counterStore.increment();
// 观察者 1: 1
// 观察者 2: 1
```

也可使用 selector，仅在选中值变化时通知：

```typescript
store.observe(
  (s) => s.count,
  (count) => console.log('count =', count)
);
```

## React

React 请使用 [`@qlover/slice-store-react`](../slice-store-react/README.md) 的 `useSliceStore`。

本地可运行 monorepo 根目录的示例台：

```bash
pnpm dev:playground
```

## 许可证

ISC
