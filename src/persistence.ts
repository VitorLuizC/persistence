interface PersistenceOptions {
  storage?: Storage;
  timeout?: number;
  placeholder?: any;
}

export default function createPersistence (name: string, options: PersistenceOptions = {}) {
  const {
    storage = window.localStorage,
    timeout,
    placeholder,
  } = options;

  return {
    set (value: any): void {
      const state = JSON.stringify({
        value,
        updatedAt: Date.now()
      });
      storage.setItem(name, state);
    },

    get (): any {
      const state = storage.getItem(name);
      if (state === null)
        return placeholder;
      const { updatedAt, value } = JSON.parse(state);
      const isExpired = timeout && Date.now() > (updatedAt + timeout);
      return isExpired ? placeholder : value;
    },

    delete (): void {
      storage.removeItem(name);
    }
  };
}
