/* eslint-disable no-unused-vars */
export type ConstructorType<T, Args extends unknown[]> =
  | (new (...args: Args) => T)
  | ((...args: Args) => T);

/**
 * Create an instance of a class or execute a function
 * @param Constructor - Class constructor or normal function
 * @param args - Arguments passed to the constructor or function
 * @returns Instance of the class or function return value
 * @throws Throws an error when the class instance is created or the function is called
 */
export function factory<T, Args extends unknown[]>(
  Constructor: ConstructorType<T, Args>,
  ...args: Args
): T {
  if (
    typeof Constructor === 'function' &&
    Constructor.prototype &&
    Constructor.prototype.constructor === Constructor
  ) {
    return new (Constructor as new (...args: Args) => T)(...args);
  }
  return (Constructor as (...args: Args) => T)(...args);
}
