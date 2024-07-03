## 简介

slice-store 可以帮助您编写行为一致、在不同环境（客户端、服务器和本机）中运行且易于测试的 JavaScript 应用程序.

## 安装

```bash
npm install @qlover/slice-store
# or use yarn
yarn add @qlover/slice-store
```

## 使用示例

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
