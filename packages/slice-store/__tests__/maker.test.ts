import { SliceStore } from '../src';

describe('SliceStore Constructor and reset method test', () => {
  describe('Use the constructor of the basic type', () => {
    test('Should correctly initialize the numeric type state', () => {
      const numberStore = new SliceStore(() => 100);
      expect(numberStore.state).toBe(100);
    });

    test('Should correctly initialize the string type state', () => {
      const stringStore = new SliceStore(() => 'hello');
      expect(stringStore.state).toBe('hello');
    });

    test('Should correctly initialize the boolean type state', () => {
      const boolStore = new SliceStore(() => true);
      expect(boolStore.state).toBe(true);
    });
  });

  describe('Use the constructor of the object type', () => {
    type TestState = {
      count: number;
      name: string;
      isActive: boolean;
    };

    test('Should correctly initialize the object type state', () => {
      const initialState: TestState = {
        count: 0,
        name: 'test',
        isActive: false
      };

      const store = new SliceStore(() => initialState);
      expect(store.state).toEqual(initialState);
      expect(store.state.count).toBe(0);
      expect(store.state.name).toBe('test');
      expect(store.state.isActive).toBe(false);
    });

    test('Use the class constructor to initialize the object state', () => {
      class TestStateClass {
        count: number = 10;
        name: string = 'class test';
        isActive: boolean = true;
      }

      const store = new SliceStore(TestStateClass);
      expect(store.state.count).toBe(10);
      expect(store.state.name).toBe('class test');
      expect(store.state.isActive).toBe(true);
    });
  });

  describe('Use inheritance to create Store', () => {
    class CounterStore extends SliceStore<number> {
      constructor(initialCount: number = 0) {
        super(() => initialCount);
      }

      increment(): void {
        this.emit(this.state + 1);
      }
    }

    test('The Store created by inheritance should be correctly initialized', () => {
      const store = new CounterStore(5);
      expect(store.state).toBe(5);
    });

    test('Initialize with default parameters', () => {
      const store = new CounterStore();
      expect(store.state).toBe(0);
    });
  });

  describe('reset method test', () => {
    test('Reset the basic type state', () => {
      const numberStore = new SliceStore(() => 100);
      numberStore.emit(200);
      expect(numberStore.state).toBe(200);

      numberStore.reset();
      expect(numberStore.state).toBe(100);
    });

    test('Reset the object type state', () => {
      type UserState = { name: string; age: number };
      const initialState: UserState = { name: 'initial user', age: 20 };

      const userStore = new SliceStore<UserState>(() => initialState);
      userStore.emit({ name: 'modified user', age: 30 });

      expect(userStore.state.name).toBe('modified user');
      expect(userStore.state.age).toBe(30);

      userStore.reset();
      expect(userStore.state.name).toBe('initial user');
      expect(userStore.state.age).toBe(20);
    });

    test('Reset the complex object and observer notification', () => {
      class TodoState {
        items: string[] = [];
        loading: boolean = false;
      }

      const todoStore = new SliceStore(TodoState);
      const mockObserver = vi.fn();

      todoStore.observe(mockObserver);

      todoStore.emit({
        items: ['task1', 'task2'],
        loading: true
      });

      expect(todoStore.state.items).toHaveLength(2);
      expect(todoStore.state.loading).toBe(true);
      expect(mockObserver).toHaveBeenCalledTimes(1);

      todoStore.reset();

      expect(todoStore.state.items).toHaveLength(0);
      expect(todoStore.state.loading).toBe(false);
      expect(mockObserver).toHaveBeenCalledTimes(2);
    });

    test('Reset the custom Store class', () => {
      class CounterStore extends SliceStore<number> {
        constructor(initialCount: number = 0) {
          super(() => initialCount);
        }

        increment(): void {
          this.emit(this.state + 1);
        }
      }

      const counterStore = new CounterStore(5);
      counterStore.increment();
      counterStore.increment();

      expect(counterStore.state).toBe(7);

      counterStore.reset();
      expect(counterStore.state).toBe(5);
    });
  });
});
