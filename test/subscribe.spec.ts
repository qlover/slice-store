import { SliceStore } from '../packages/main';

type Value = {
  count: number;
};

class AppStore extends SliceStore<Value> {
  constructor() {
    super(() => ({ count: 1 }));
  }
  inc() {
    const newState = {
      count: this.state.count + 1
    };
    this.emit(newState);
  }
}

describe('subscribe', () => {
  test('many', () => {
    const appStore = new AppStore();
  });

  test('observe count changes using appStore.observe', () => {
    const appStore = new AppStore();
    
    let lastCount = appStore.state.count;
    const unsubscribe = appStore.observe((state) => state.count, (newCount) => {
      lastCount = newCount;
    });

    expect(lastCount).toBe(1); // 初始值应该是1

    appStore.inc();
    expect(lastCount).toBe(2);

    appStore.inc();
    expect(lastCount).toBe(3);

    unsubscribe(); // 取消订阅
  });
});
