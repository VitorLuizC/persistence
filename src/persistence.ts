interface IStorage {
  getItem (key: string): string | null;
  setItem (key: string, value: string): void;
  removeItem (key: string): void;
}

/**
 * Persistence options to set timeout, storage and placeholder value.
 */
export interface PersistenceOptions <T = any> {
  storage?: IStorage;
  timeout?: number;
  placeholder?: T;
}

/**
 * An object to easily get and set values to a persistent storages like
 * `SessionStorage` and `LocalStorage`.
 */
export interface Persistence <T = any, U = (T | undefined)> {
  /**
   * Set a value to a persistent storage.
   * @param value - Any JSON parseable value can be setted.
   */
  set (value: T): void;

  /**
   * Get value from persistent storage.
   */
  get (): T | U;

  /**
   * Delete value from persistent storage.
   */
  delete (): void;
}

/**
 * Creates a Persistence, an object to easily get and set values to a persistent
 * storage like `SessionStorage` or `LocalStorage`.
 * @example ```js
 * const state = createPersistence('state@name', {
 *   placeholder: 'Unknown'
 * });
 *
 * // This creates a persistent field's value.
 * const el = document.querySelector('input[name="name"]');
 * el.value = state.get();
 * el.addEventListener('input', () => state.set(el.value));```
 * @param name - Persistence uses the name as storage's key.
 * @param options - Options to set timeout, storage and placeholder value.
 */
const createPersistence: {
  <T = any, U = T> (
    name: string,
    options: PersistenceOptions & { placeholder: U; },
  ): Persistence<T, U>;

  <T = any, U = (T | undefined)> (
    name: string,
    options?: PersistenceOptions<U>,
  ): Persistence<T, U>;
} = (name: string, options: PersistenceOptions = {}): Persistence => {
  const {
    storage = window.localStorage,
    timeout,
    placeholder,
  } = options;

  const isExpired = (updatedAt: number): boolean => (
    timeout !== undefined &&
    Date.now() > (updatedAt + timeout)
  );

  return {
    set: (value) => {
      const state = JSON.stringify({
        value,
        updatedAt: Date.now()
      });
      storage.setItem(name, state);
    },

    get: () => {
      const state = storage.getItem(name);
      if (state === null)
        return placeholder;
      const register = JSON.parse(state) as { updatedAt: number, value: any };
      return isExpired(register.updatedAt) ? placeholder : register.value;
    },

    delete: () => storage.removeItem(name)
  };
};

export default createPersistence;
