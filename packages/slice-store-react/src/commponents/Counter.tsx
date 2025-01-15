import { SliceStore } from '@qlover/slice-store';
import { useSliceStore } from '../useSliceStore';

class AppStore extends SliceStore<{ count: number }> {
  constructor() {
    super(() => ({ count: 1 }));
  }

  inc = () => {
    this.emit({ count: this.state.count + 1 });
  };

  dec = () => {
    this.emit({ count: this.state.count - 1 });
  };
}

const appStore = new AppStore();

export default function Counter() {
  const { count } = useSliceStore(appStore);

  return (
    <>
      <h1>React Slice Store</h1>
      <div className="card">
        <button data-testid="incrementButton" onClick={appStore.inc}>
          incrementButton
        </button>
        <button data-testid="decrementButton" onClick={appStore.dec}>
          decrementButton
        </button>
      </div>
      <div data-testid="countText">{count}</div>
    </>
  );
}
