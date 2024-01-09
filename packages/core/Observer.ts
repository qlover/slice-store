const identity = <T>(value: T) => value;

type ObserverHandler<T> = (value: T) => void;
export class Observer<T> {
  private handlers: ObserverHandler<T> = identity;

  observer = (fn: ObserverHandler<T>) => {
    this.handlers = fn;
  };

  notify = (value: T) => {
    this.handlers(value);
  };

  clear = (fn: ObserverHandler<T>) => {
    this.handlers = identity;
  };
}
