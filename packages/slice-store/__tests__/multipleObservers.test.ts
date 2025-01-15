import { SliceStore } from '../src';

type Value = {
  count: number;
  name: string;
};

class AppStore extends SliceStore<Value> {
  constructor() {
    super(() => ({ count: 1, name: 'initial' }));
  }

  increment(): void {
    this.emit({ ...this.state, count: this.state.count + 1 });
  }

  changeName(newName: string): void {
    this.emit({ ...this.state, name: newName });
  }
}

describe('multiple observers', () => {
  test('observers should only be called when their selected state changes', () => {
    const appStore = new AppStore();

    let countObserverCalled = 0;
    let nameObserverCalled = 0;
    let fullStateObserverCalled = 0;

    // 观察者1: 只关注 count
    const unsubscribeCount = appStore.observe(
      (state) => state.count,
      (newCount) => {
        countObserverCalled++;
        expect(newCount).toBe(appStore.state.count);
      }
    );

    // 观察者2: 只关注 name
    const unsubscribeName = appStore.observe(
      (state) => state.name,
      (newName) => {
        nameObserverCalled++;
        expect(newName).toBe(appStore.state.name);
      }
    );

    // 观察者3: 关注整个状态
    const unsubscribeFullState = appStore.observe((newState) => {
      fullStateObserverCalled++;
      expect(newState).toEqual(appStore.state);
    });

    // 初始状态不应触发观察者
    expect(countObserverCalled).toBe(0);
    expect(nameObserverCalled).toBe(0);
    expect(fullStateObserverCalled).toBe(0);

    // 只改变 count
    appStore.increment();
    expect(countObserverCalled).toBe(1);
    expect(nameObserverCalled).toBe(0); // 这里应该是 0，但实际上可能是 1
    expect(fullStateObserverCalled).toBe(1);

    // 只改变 name
    appStore.changeName('new name');
    expect(countObserverCalled).toBe(1); // 这里应该是 1，但实际上可能是 2
    expect(nameObserverCalled).toBe(1);
    expect(fullStateObserverCalled).toBe(2);

    // 取消订阅
    unsubscribeCount();
    unsubscribeName();
    unsubscribeFullState();

    // 再次触发状态变化,观察者不应被调用
    appStore.increment();
    expect(countObserverCalled).toBe(1);
    expect(nameObserverCalled).toBe(1);
    expect(fullStateObserverCalled).toBe(2);
  });

  test('多个观察者监听同一状态时应该都被触发', () => {
    const appStore = new AppStore();

    let observer1CalledCount = 0;
    let observer2CalledCount = 0;
    let observer3CalledCount = 0;

    const unsubscribe1 = appStore.observe(
      (state) => state.count,
      (newCount) => {
        observer1CalledCount++;
        expect(newCount).toBe(appStore.state.count);
      }
    );

    const unsubscribe2 = appStore.observe(
      (state) => state.count,
      (newCount) => {
        observer2CalledCount++;
        expect(newCount).toBe(appStore.state.count);
      }
    );

    const unsubscribe3 = appStore.observe(
      (state) => state.count,
      (newCount) => {
        observer3CalledCount++;
        expect(newCount).toBe(appStore.state.count);
      }
    );

    // 初始状态不应触发观察者
    expect(observer1CalledCount).toBe(0);
    expect(observer2CalledCount).toBe(0);
    expect(observer3CalledCount).toBe(0);

    // 改变 count，所有观察者都应被触发
    appStore.increment();
    expect(observer1CalledCount).toBe(1);
    expect(observer2CalledCount).toBe(1);
    expect(observer3CalledCount).toBe(1);

    // 再次改变 count，所有观察者再次被触发
    appStore.increment();
    expect(observer1CalledCount).toBe(2);
    expect(observer2CalledCount).toBe(2);
    expect(observer3CalledCount).toBe(2);

    // 改变 name 不应触发 count 观察者
    appStore.changeName('new name');
    expect(observer1CalledCount).toBe(2);
    expect(observer2CalledCount).toBe(2);
    expect(observer3CalledCount).toBe(2);

    // 取消订阅观察者2
    unsubscribe2();

    // 再次改变 count，观察���1和3应被触发，观察者2不应被触发
    appStore.increment();
    expect(observer1CalledCount).toBe(3);
    expect(observer2CalledCount).toBe(2);
    expect(observer3CalledCount).toBe(3);

    // 取消所有订阅
    unsubscribe1();
    unsubscribe3();

    // 再次触发状态变化，所有观察者都不应被调用
    appStore.increment();
    expect(observer1CalledCount).toBe(3);
    expect(observer2CalledCount).toBe(2);
    expect(observer3CalledCount).toBe(3);
  });

  test('连续多次改变状态，观察者应该被多次触发', () => {
    const appStore = new AppStore();

    let observerCalledCount = 0;

    const unsubscribe = appStore.observe(
      (state) => state.count,
      (newCount) => {
        observerCalledCount++;
        expect(newCount).toBe(appStore.state.count);
      }
    );

    // 初始状态不应触发观察者
    expect(observerCalledCount).toBe(0);

    // 连续多次改变 count，观察者应该被多次触发
    appStore.increment();
    appStore.increment();
    appStore.increment();
    expect(observerCalledCount).toBe(3);

    // 改变 name 不应触发 count 观察者
    appStore.changeName('new name');
    expect(observerCalledCount).toBe(3);

    // 取消订阅
    unsubscribe();

    // 再次触发状态变化，观察者不应被调用
    appStore.increment();
    expect(observerCalledCount).toBe(3);
  });
});
