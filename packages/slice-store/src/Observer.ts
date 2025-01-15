export type Selector<T, K> = (state: T) => K;
export type Listener<T> = (value: T) => void;
export type ObserverItem<T> = {
  selector?: Selector<T, any>;
  listener: Listener<any>;
};
export type CompareFunction<T> = (a: T, b: T) => boolean;
export class Observer<T> {
  private observers: Array<ObserverItem<T>> = [];
  private lastValues: Map<ObserverItem<T>, any> = new Map();

  private compare: CompareFunction<T> = Object.is;

  observe<K = T>(
    selectorOrListener: Selector<T, K> | Listener<T>,
    listener?: Listener<K>
  ): () => void {
    let selector: Selector<T, any> | undefined;
    let actualListener: Listener<any>;

    if (typeof selectorOrListener === 'function' && listener) {
      selector = selectorOrListener as Selector<T, K>;
      actualListener = listener;
    } else {
      actualListener = selectorOrListener as Listener<T>;
    }

    const observer: ObserverItem<T> = { selector, listener: actualListener };
    this.observers.push(observer);

    return () => {
      const index = this.observers.indexOf(observer);
      if (index > -1) {
        this.observers.splice(index, 1);
        this.lastValues.delete(observer);
      }
    };
  }

  notify(value: T, lastValue?: T): void {
    for (const observer of this.observers) {
      const { selector, listener } = observer;
      if (selector) {
        const newSelectedValue = selector(value);
        const lastSelectedValue =
          lastValue !== undefined
            ? selector(lastValue)
            : this.lastValues.get(observer);

        if (typeof this.compare === 'function') {
          if (!this.compare(newSelectedValue, lastSelectedValue)) {
            this.lastValues.set(observer, newSelectedValue);
            listener(newSelectedValue);
          }
        } else {
          if (newSelectedValue !== lastSelectedValue) {
            this.lastValues.set(observer, newSelectedValue);
            listener(newSelectedValue);
          }
        }
      } else {
        listener(value);
      }
    }
  }

  clear(): void {
    this.observers = [];
    this.lastValues.clear();
  }
}
