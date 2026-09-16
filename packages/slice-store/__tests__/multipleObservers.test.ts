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

    const unsubscribeCount = appStore.observe(
      (state) => state.count,
      (newCount) => {
        countObserverCalled++;
        expect(newCount).toBe(appStore.state.count);
      }
    );

    const unsubscribeName = appStore.observe(
      (state) => state.name,
      (newName) => {
        nameObserverCalled++;
        expect(newName).toBe(appStore.state.name);
      }
    );

    const unsubscribeFullState = appStore.observe((newState) => {
      fullStateObserverCalled++;
      expect(newState).toEqual(appStore.state);
    });

    expect(countObserverCalled).toBe(0);
    expect(nameObserverCalled).toBe(0);
    expect(fullStateObserverCalled).toBe(0);

    appStore.increment();
    appStore.flush();
    expect(countObserverCalled).toBe(1);
    expect(nameObserverCalled).toBe(0);
    expect(fullStateObserverCalled).toBe(1);

    appStore.changeName('new name');
    appStore.flush();
    expect(countObserverCalled).toBe(1);
    expect(nameObserverCalled).toBe(1);
    expect(fullStateObserverCalled).toBe(2);

    unsubscribeCount();
    unsubscribeName();
    unsubscribeFullState();

    appStore.increment();
    appStore.flush();
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

    expect(observer1CalledCount).toBe(0);
    expect(observer2CalledCount).toBe(0);
    expect(observer3CalledCount).toBe(0);

    appStore.increment();
    appStore.flush();
    expect(observer1CalledCount).toBe(1);
    expect(observer2CalledCount).toBe(1);
    expect(observer3CalledCount).toBe(1);

    appStore.increment();
    appStore.flush();
    expect(observer1CalledCount).toBe(2);
    expect(observer2CalledCount).toBe(2);
    expect(observer3CalledCount).toBe(2);

    appStore.changeName('new name');
    appStore.flush();
    expect(observer1CalledCount).toBe(2);
    expect(observer2CalledCount).toBe(2);
    expect(observer3CalledCount).toBe(2);

    unsubscribe2();

    appStore.increment();
    appStore.flush();
    expect(observer1CalledCount).toBe(3);
    expect(observer2CalledCount).toBe(2);
    expect(observer3CalledCount).toBe(3);

    unsubscribe1();
    unsubscribe3();

    appStore.increment();
    appStore.flush();
    expect(observer1CalledCount).toBe(3);
    expect(observer2CalledCount).toBe(2);
    expect(observer3CalledCount).toBe(3);
  });

  test('连续多次同步改变状态，观察者应合并为一次通知', () => {
    const appStore = new AppStore();

    let observerCalledCount = 0;
    let lastCount = 0;

    const unsubscribe = appStore.observe(
      (state) => state.count,
      (newCount) => {
        observerCalledCount++;
        lastCount = newCount;
      }
    );

    expect(observerCalledCount).toBe(0);

    appStore.increment();
    appStore.increment();
    appStore.increment();
    expect(observerCalledCount).toBe(0);

    appStore.flush();
    expect(observerCalledCount).toBe(1);
    expect(lastCount).toBe(4);
    expect(appStore.state.count).toBe(4);

    appStore.changeName('new name');
    appStore.flush();
    expect(observerCalledCount).toBe(1);

    unsubscribe();

    appStore.increment();
    appStore.flush();
    expect(observerCalledCount).toBe(1);
  });
});
