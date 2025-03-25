import { ConstructorType, factory } from './factory';
import { Observer } from './Observer';

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
export class SliceStore<T> extends Observer<T> {
  /**
   * The internal state object
   * @private
   */
  private _state: T;

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
  get state(): T {
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
  setDefaultState(value: T): this {
    this._state = value;
    return this;
  }

  /**
   * Update the state and notify all observers
   *
   * This method will replace the current state object and trigger all subscribed observers.
   * The observers will receive the new and old state as parameters.
   *
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
  emit(state: T): void {
    const lastValue = this.state;
    this._state = state;
    this.notify(this._state, lastValue);
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
  reset(): void {
    this.emit(factory(this.maker));
  }
}
