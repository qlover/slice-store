import { SliceStore } from '@qlover/slice-store';
import { useSliceStore } from '@qlover/slice-store-react';

class AppStore extends SliceStore<{ count: number }> {
  constructor() {
    super(() => ({ count: 1 }));
  }

  inc = (): void => {
    this.emit({ count: this.state.count + 1 });
  };

  dec = (): void => {
    this.emit({ count: this.state.count - 1 });
  };
}

const appStore = new AppStore();

export default function Counter() {
  const { count } = useSliceStore(appStore);

  return (
    <section>
      <h2>React Slice Store 计数器</h2>
      <div>
        <button data-testid="incrementButton" onClick={appStore.inc}>
          +1
        </button>
        <button data-testid="decrementButton" onClick={appStore.dec}>
          -1
        </button>
      </div>
      <div data-testid="countText">{count}</div>
    </section>
  );
}
