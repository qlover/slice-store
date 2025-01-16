# slice-store

## 简介

slice-store 是一个强大的状态管理库，可以帮助您编写行为一致、在不同环境（客户端、服务器和本机）中运行且易于测试的 JavaScript 应用程序。它提供了一种简单而有效的方式来管理和更新应用程序的状态。

## 特性

- 简单易用的 API
- 支持多种数据类型（对象、数组、数字等）
- 可观察的状态更新
- 支持同一状态绑定多个处理事件
- 类型安全（使用 TypeScript）
- 跨平台兼容性

## 安装

```bash
npm install @qlover/slice-store
# 或使用 yarn
yarn add @qlover/slice-store
```

## 基本使用示例

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

## 多观察者使用示例

slice-store 现在支持为同一个状态绑定多个处理事件。这使得您可以更灵活地响应状态变化：

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

// 绑定多个观察者
counterStore.subscribe((state) => {
  console.log('Observer 1:', state);
});

counterStore.subscribe((state) => {
  console.log('Observer 2:', state);
});

counterStore.increment();
// 输出:
// Observer 1: 1
// Observer 2: 1

counterStore.increment();
// 输出:
// Observer 1: 2
// Observer 2: 2
```

这个例子展示了如何为同一个状态绑定多个观察者，每个观察者都会在状态变化时被调用。