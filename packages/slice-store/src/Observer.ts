/**
 * State selector function type
 * Selects specific parts or derived data from the state
 * @template T - Input state type
 * @template K - Selector output type
 */
export type Selector<T, K> = (state: T) => K;

/**
 * Listener function type
 * Handles the callback function for state changes
 * @template T - The type of data being listened to
 */
export type Listener<T> = (value: T) => void;

/**
 * Observer item type
 * Represents the configuration of an observer, containing an optional selector and a required listener
 * @template T - The type of the observed state
 */
export type ObserverItem<T> = {
  /**
   * Optional selector function, used to extract specific data from the state
   * If provided, the listener will only be called when the selected data changes
   */
  selector?: Selector<T, unknown>;
  
  /**
   * Listener function, called when the state changes
   */
  listener: Listener<unknown>;
};

/**
 * Compare function type
 * Used to determine if two values are equal
 * @template T - The type of the values being compared
 */
export type CompareFunction<T> = (a: T, b: T) => boolean;

/**
 * Observer implementation class
 * 
 * The Observer class provides an implementation of the publish-subscribe pattern, allowing components to subscribe to state changes.
 * It supports the use of selector functions to listen to specific parts of the state, and only notifies related listeners when these parts change.
 * 
 * Main features:
 * 1. Register listeners, optionally providing a selector function
 * 2. Notify all listeners of state changes
 * 3. Support selective notification (only notify when the selected state part changes)
 * 4. Provide a method to clear all listeners
 * 5. Support custom comparison functions to determine if the state has changed
 * 
 * @template T - The type of the observed state
 * 
 * @example Basic usage
 * ```typescript
 * const observer = new Observer<{count: number, name: string}>();
 * 
 * // Listen to the entire state
 * observer.observe(state => {
 *   console.log('Change:', state);
 * });
 * 
 * // Listen to the count property
 * observer.observe(
 *   state => state.count,
 *   count => console.log('Count changed:', count)
 * );
 * 
 * // Notify all listeners
 * observer.notify({count: 1, name: 'Test'});
 * ```
 */
export class Observer<T> {
  /**
   * Store all registered observers
   * @private
   */
  private observers: Array<ObserverItem<T>> = [];
  
  /**
   * Store the last selected value for each observer, used for comparison
   * @private
   */
  private lastValues: Map<ObserverItem<T>, unknown> = new Map();

  /**
   * Function used to compare values for equality
   * Defaults to Object.is
   * @private
   */
  private compare: CompareFunction<T> = Object.is;

  /**
   * Register an observer to listen for state changes
   * 
   * This method supports two calling methods:
   * 1. Provide a listener that listens to the entire state
   * 2. Provide a selector and a listener that listens to the selected part
   * 
   * @template K - The type of the selector output
   * @param {Selector<T, K> | Listener<T>} selectorOrListener - Selector function or listener that listens to the entire state
   * @param {Listener<K>} [listener] - Listener for the selected result when a selector is provided
   * @returns {() => void} The function to unsubscribe, calling it removes the registered observer
   * 
   * @example Listen to the entire state
   * ```typescript
   * const unsubscribe = observer.observe(state => {
   *   console.log('Full state:', state);
   * });
   * 
   * // Unsubscribe
   * unsubscribe();
   * ```
   * 
   * @example Listen to a specific part of the state
   * ```typescript
   * const unsubscribe = observer.observe(
   *   state => state.user,
   *   user => console.log('User information changed:', user)
   * );
   * ```
   */
  observe<K = T>(
    selectorOrListener: Selector<T, K> | Listener<T>,
    listener?: Listener<K>
  ): () => void {
    let selector: Selector<T, unknown> | undefined;
    let actualListener: Listener<unknown>;

    if (typeof selectorOrListener === 'function' && listener) {
      selector = selectorOrListener as Selector<T, K>;
      actualListener = listener as Listener<unknown>;
    } else {
      actualListener = selectorOrListener as Listener<unknown>;
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

  /**
   * Notify all observers that the state has changed
   * 
   * This method will iterate through all registered observers and call their listeners.
   * If an observer has a selector, it will only notify when the selected state part changes.
   * 
   * @param {T} value - The new state value
   * @param {T} [lastValue] - Optional previous state value, used for comparison
   * 
   * @example
   * ```typescript
   * // Notify observers that the state has changed
   * observer.notify({count: 2, name: 'New name'});
   * 
   * // Provide the previous state for comparison
   * const oldState = {count: 1, name: 'Old name'};
   * const newState = {count: 2, name: 'New name'};
   * observer.notify(newState, oldState);
   * ```
   */
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
          if (!this.compare(newSelectedValue as T, lastSelectedValue as T)) {
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

  /**
   * Clear all observers
   * 
   * This method removes all registered listeners and their last selected values.
   * It is useful when the component is unloaded or needs to reset the observer state.
   * 
   * @example
   * ```typescript
   * // Register some observers
   * observer.observe(state => console.log(state));
   * 
   * // Remove all observers
   * observer.clear();
   * 
   * // Now notifications will not trigger any listeners
   * observer.notify({count: 3});
   * ```
   */
  clear(): void {
    this.observers = [];
    this.lastValues.clear();
  }
}
