import { SliceStore } from '../packages/main';

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

describe('type array store', () => {
  test('call inc', () => {
    const appStore = new AppStore();
    appStore.incAll();

    expect(appStore.state[0].count).toBe(2);

    appStore.incAll();
    const state = appStore.state;
    expect(state[0].count).toBe(3);
  });
});
