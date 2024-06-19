import { Observer } from './Observer';

export class SliceStore<T> extends Observer<T> {
  private mounted = false;
  state: T;

  constructor(initState: () => T) {
    super();
    this.state = initState();
  }

  setDefaultState(value: T): this {
    this.state = value;
    return this;
  }

  setup(fn: any): void {
    if (this.mounted) {
      return;
    }
    this.mounted = true;
    fn();
  }

  emit(state: T): void {
    this.state = state;
    this.notify(state);
  }
}
