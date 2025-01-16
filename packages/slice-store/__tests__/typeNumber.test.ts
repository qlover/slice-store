import { SliceStore } from '../src';

class AppStore extends SliceStore<number> {
  constructor() {
    super(() => 1);
  }

  inc(): void {
    this.emit(this.state + 1);
  }
}

describe('type number store', () => {
  test('call inc', () => {
    const appStore = new AppStore();
    appStore.inc();
    expect(appStore.state).toBe(2);

    appStore.inc();
    expect(appStore.state).toBe(3);
  });
});
