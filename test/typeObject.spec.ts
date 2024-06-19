import { SliceStore } from '../src';

type Value = {
  count: number;
};
class AppStore extends SliceStore<Value> {
  constructor() {
    super(() => ({ count: 1 }));
  }
  inc() {
    this.emit(Object.assign(this.state, { count: this.state.count + 1 }));
  }
}

describe('type object store', () => {
  test('call inc', () => {
    const appStore = new AppStore();
    appStore.inc();
    expect(appStore.state.count).toBe(2);

    appStore.inc();
    const state = appStore.state;
    expect(state.count).toBe(3);

    expect(appStore.state).toEqual(state);
  });
});
