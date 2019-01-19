export interface PersistenceOptions <T = any> {
  storage?: Storage;
  timeout?: number;
  placeholder?: T;
}

export interface Persistence <T = any, U = (T | undefined)> {
  set (value: T): void;
  get (): T | U;
  delete (): void;
}

const createPersistence: {
  <T = any, U = T> (
    name: string,
    options: PersistenceOptions & { placeholder: U; },
  ): Persistence<T, U>;

  <T = any, U = (T | undefined)> (
    name: string,
    options?: PersistenceOptions<U>,
  ): Persistence<T, U>;
} = (
  name: string, {
    storage = window.localStorage,
    timeout,
    placeholder,
  }: PersistenceOptions = {}
): Persistence => ({
  set (value) {
    const state = JSON.stringify({
      value,
      updatedAt: Date.now()
    });
    storage.setItem(name, state);
  },

  get () {
    const state = storage.getItem(name);
    if (state === null)
      return placeholder;
    const { updatedAt, value } = JSON.parse(state);
    const isExpired = timeout !== undefined && Date.now() > (updatedAt + timeout);
    return isExpired ? placeholder : value;
  },

  delete () {
    storage.removeItem(name);
  }
});

export default createPersistence;
