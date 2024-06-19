const identity = <T>(value: T): T => value;

type ObserverHandler<T> = (value: T) => void;
export class Observer<T> {
  private handlers: ObserverHandler<T> = identity;

  observer(fn: ObserverHandler<T>): void {
    this.handlers = fn;
  }

  notify(value: T): void {
    this.handlers(value);
  }

  clear(): void {
    this.handlers = identity;
  }
}
