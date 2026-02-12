import { factory } from './factory';
import { Observer } from './Observer';
import type { ConstructorType } from './factory';
import type { Listener, Selector, Unsubscribe } from './Observer';
import type { SliceStoreInterface } from './SliceStoreInterface';
/**
 * State Slice Store
 *
 * SliceStore is a state management container that maintains a state object and notifies observers when the state changes.
 * It inherits from Observer and implements the publish-subscribe pattern, allowing components to subscribe to state changes.
 *
 * Main features:
 * 1. Maintain a mutable state
 * 2. Provide read access to the state
 * 3. Allow updating the state through emit
 * 4. Reset the state to the initial value
 * 5. Notify all observers when the state changes
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
 * userStore.subscribe((newState, oldState) => {
 *   console.log('状态已更新:', newState, oldState);
 * });
 *
 * // Update state
 * userStore.emit({ name: '张三', age: 30 });
 *
 * // Reset state
 * userStore.reset();
 * ```
 *
 * @template T - The type of the state
 */
export class SliceStore<T> implements SliceStoreInterface<T> {
  protected observer: Observer<T>;
  private _state: T;

  /**
   * @deprecated
   */
  public get state(): T {
    return this.getState();
  }

  /**
   * 兼容1.3.0-
   * @deprecated use `set`
   */
  public emit(state: T): void {
    this.set(state);
  }

  /**
   * Get the current state
   *
   * This property is read-only, returning a reference to the stored state object.
   * Note: This returns a reference, not a deep copy. Modifying the returned object's properties will directly affect the internal state.
   *
   * @override
   * @example
   * ```typescript
   * const currentState = store.state;
   * console.log(currentState);
   * ```
   *
   * @returns {T} The current state object
   */
  public getState(): T {
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
    private maker: ConstructorType<T, unknown[]>,

    /**
     * The observer, used to notify all observers when the state changes
     *
     * You can override the Observer to implement your own logic
     *
     * @example Override the Observer's compare method to control state updates
     * ```ts
     * class MyObserver extends Observer<T> {
     *   compare(a: T, b: T): boolean {
     *     return a.name === b.name;
     *   }
     * }
     *
     * const myObserver = new MyObserver<T>();
     * const myStore = new SliceStore<T>(MyStateClass, myObserver);
     * ```
     *
     * @since 1.3.0
     * @default new Observer<T>()
     */
    observer?: Observer<T>
  ) {
    this.observer = observer ?? new Observer<T>();
    this._state = factory(maker);
  }

  /**
   * Update the state and notify all observers
   *
   * This method will replace the current state object and trigger all subscribed observers.
   * The observers will receive the new and old state as parameters.
   *
   * @override
   * @param {T} state - The new state object
   *
   * @example
   * ```typescript
   * interface UserState {
   *   name: string;
   *   age: number;
   * }
   *
   * const userStore = new SliceStore<UserState>({
   *   name: 'John',
   *   age: 20,
   * });
   * userStore.emit({ name: 'Jane', age: 25 });
   * ```
   */
  public set(state: T): void {
    const lastValue = this.getState();
    this._state = state;
    this.observer.notify(state, lastValue);
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
   * @override
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
    this.set(factory(this.maker));
  }

  /**
   * @since 1.3.0
   * @override
   */
  public observe<K = T>(
    selectorOrListener: Selector<T, K> | Listener<T>,
    listener?: Listener<K>
  ): Unsubscribe {
    return this.observer.observe<K>(selectorOrListener, listener);
  }

  /**
   * @since 1.3.0
   * @override
   */
  public clear(): void {
    this.observer.clear();
  }
}
