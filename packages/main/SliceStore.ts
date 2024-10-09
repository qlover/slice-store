import { Observer } from './Observer';

export class SliceStore<T> extends Observer<T> {
  private mounted = false;
  private _state: T;

  get state(): T {
    return this._state;
  }

  constructor(initState: () => T) {
    super();
    this._state = initState();
  }

  setDefaultState(value: T): this {
    this._state = value;
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
    const lastValue = this.state;
    this._state = state;
    this.notify(this._state, lastValue);
  }
}
