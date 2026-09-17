import { ConstructorType, factory } from './factory';
import { Observer } from './Observer';

/**
 * Updater function that receives the previous state and returns the next state.
 *
 * Prefer this form when multiple async flows may update different fields,
 * so each write is applied against the latest state at commit time.
 *
 * @template T - The type of the state
 */
export type StateUpdater<T> = (prev: T) => T;

/**
 * Options for {@link SliceStore.emit}
 */
export type EmitOptions = {
  /**
   * When `true`, notify observers immediately instead of deferring to a microtask.
   *
   * Useful in tests or when a subscriber must run synchronously after emit.
   *
   * @default false
   */
  flush?: boolean;
};

/**
 * State Slice Store
 *
 * SliceStore is a state management container that maintains a state object and notifies observers when the state changes.
 * It inherits from Observer and implements the publish-subscribe pattern, allowing components to subscribe to state changes.
 *
 * Main features:
 * 1. Maintain a mutable state
 * 2. Provide read access to the state
 * 3. Allow updating the state through emit (value or updater)
 * 4. Reset the state to the initial value
 * 5. Notify all observers when the state changes (batched by microtask by default)
 *
 * @example Basic usage
 * ```typescript
 * class UserState {
 *   name: string = '';
 *   age: number = 0;
 * }
 *
 * const userStore = new SliceStore(UserState);
 *
 * // Subscribe to state changes
 * userStore.observe((newState) => {
 *   console.log('state updated:', newState);
 * });
 *
 * // Update state (notification is deferred to a microtask)
 * userStore.emit({ name: 'Alice', age: 30 });
 *
 * // Reset state
 * userStore.reset();
 * ```
 *
 * @template T - The type of the state
 */
export class SliceStore<T> extends Observer<T> {
  /**
   * The internal state object
   * @private
   */
  private _state: T;

  /**
   * Whether a microtask flush has already been scheduled
   * @private
   */
  private pendingNotify = false;

  /**
   * The state snapshot before the first emit in the current microtask batch
   * @private
   */
  private batchOldState?: T;

  /**
   * Get the current state
   *
   * This property is read-only, returning a reference to the stored state object.
   * Note: This returns a reference, not a deep copy. Modifying the returned object's properties will directly affect the internal state.
   *
   * @example
   * ```typescript
   * const currentState = store.state;
   * console.log(currentState);
   * ```
   *
   * @returns {T} The current state object
   */
  public get state(): T {
    return this._state;
  }

  /**
   * Create a new state slice store instance
   *
   * The constructor receives a state constructor, which is used to initialize the default state.
   * The state constructor will be immediately called to create the initial state object.
   *
   * @param {ConstructorType<T, unknown[]>} maker - The state constructor, used to create the initial state
   *
   * @example
   * ```typescript
   * class TodoState {
   *   items: string[] = [];
   *   loading: boolean = false;
   * }
   *
   * const todoStore = new SliceStore(TodoState);
   * ```
   */
  constructor(
    /**
     * The state constructor, used to create the initial state
     *
     * **But maker not supported pass parameters, so it's not recommended to pass parameters to the constructor**
     *
     * @example
     * ```typescript
     * class TodoState {
     *   items: string[] = [];
     *   loading: boolean = false;
     * }
     *
     * const todoStore = new SliceStore(TodoState);
     * ```
     *
     * @since 1.2.5
     */
    private maker: ConstructorType<T, unknown[]>
  ) {
    super();
    this._state = factory(maker);
  }

  /**
   * Set the default state
   *
   * Replace the entire state object, but will not trigger the observer notification.
   * This method is mainly used for initialization, not recommended for regular state updates.
   *
   * @deprecated Please use the constructor parameter or the emit method instead
   * @param {T} value - The new state object to set
   * @returns {this} The current instance, supporting method chaining
   *
   * @example
   * ```typescript
   * // Not recommended to use
   * store.setDefaultState(initialState);
   *
   * // Recommended alternative
   * store.emit(initialState);
   * ```
   */
  public setDefaultState(value: T): this {
    this._state = value;
    return this;
  }

  /**
   * Update the state and schedule observer notification
   *
   * By default, consecutive `emit` calls in the same synchronous turn are merged:
   * state is updated immediately, but observers are notified once in a microtask
   * with the first old state and the final new state.
   *
   * Pass an updater function when parallel async flows may race on different fields.
   * Pass `{ flush: true }` when observers must run synchronously.
   *
   * @param {T | StateUpdater<T>} stateOrUpdater - Next state, or a function of previous state
   * @param {EmitOptions} [options] - Emit options
   *
   * @example Value emit with automatic batching
   * ```typescript
   * store.emit({ ...store.state, a: 1 });
   * store.emit({ ...store.state, b: 2 });
   * // observers notified once: { a: 1, b: 2 }
   * ```
   *
   * @example Updater emit (safe for concurrent writes)
   * ```typescript
   * store.emit((s) => ({ ...s, a: 1 }));
   * store.emit((s) => ({ ...s, b: 2 }));
   * ```
   *
   * @example Immediate notify
   * ```typescript
   * store.emit({ ...store.state, ready: true }, { flush: true });
   * ```
   */
  public emit(stateOrUpdater: StateUpdater<T>, options?: EmitOptions): void;
  public emit(stateOrUpdater: T, options?: EmitOptions): void;
  public emit(
    stateOrUpdater: T | StateUpdater<T>,
    options?: EmitOptions
  ): void {
    const lastValue = this._state;
    this._state =
      typeof stateOrUpdater === 'function'
        ? (stateOrUpdater as StateUpdater<T>)(lastValue)
        : stateOrUpdater;

    if (options?.flush) {
      this.flushPending(lastValue);
      return;
    }

    this.scheduleNotify(lastValue);
  }

  /**
   * Flush a pending batched notification immediately
   *
   * If no notification is pending, this is a no-op.
   * Use this in tests or when you need subscribers to run before continuing.
   *
   * @example
   * ```typescript
   * store.emit({ ...store.state, count: 1 });
   * store.flush(); // notify now
   * ```
   */
  public flush(): void {
    this.flushPending();
  }

  /**
   * Reset the state to the initial value
   *
   * This method will use the maker provided in the constructor to create a new state object,
   * and then emit it as the current state, triggering a notification to all observers.
   *
   * Use cases:
   * - When you need to clear all state
   * - When you need to restore to the initial state
   * - When the current state is polluted or invalid
   *
   * @example
   * ```typescript
   * const store = new SliceStore(MyStateClass);
   * // ... some operations modified the state ...
   * store.reset(); // The state is reset to the initial value
   * ```
   *
   * @since 1.2.5
   */
  public reset(): void {
    this.emit(factory(this.maker));
  }

  /**
   * Schedule a microtask notification if one is not already pending
   * @private
   */
  private scheduleNotify(lastValue: T): void {
    if (!this.pendingNotify) {
      this.pendingNotify = true;
      this.batchOldState = lastValue;
      queueMicrotask(() => {
        this.flushPending();
      });
    }
  }

  /**
   * Notify observers with the current state if a batch is pending,
   * or notify immediately when `fallbackOldState` is provided for a flush emit.
   * @private
   */
  private flushPending(fallbackOldState?: T): void {
    if (this.pendingNotify) {
      const oldState = this.batchOldState as T;
      this.pendingNotify = false;
      this.batchOldState = undefined;
      this.notify(this._state, oldState);
      return;
    }

    if (fallbackOldState !== undefined) {
      this.notify(this._state, fallbackOldState);
    }
  }
}
