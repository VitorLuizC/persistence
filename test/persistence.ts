import createPersistence, { Persistence } from '../';
import test, { beforeEach } from 'ava';

const storage = {
  _state: {} as Record<string, string>,
  setItem (key: string, value: string): void {
    this._state[key] = value;
  },
  getItem (key: string): null | string {
    const value = this._state[key];
    return value === undefined ? null : value;
  },
  removeItem (key: string): void {
    delete this._state[key];
  },
  clear (): void {
    this._state = {};
  }
};

beforeEach(() => storage.clear());

test('API: module default exports a function', (context) => {
  context.is(typeof createPersistence, 'function');
});

test('API: animate returns Animation', (context) => {
  const persistence: Persistence<number> = createPersistence('name', { storage });

  context.truthy(persistence);
  context.is(typeof persistence, 'object');
  context.is(typeof persistence.get, 'function');
  context.is(typeof persistence.set, 'function');
  context.is(typeof persistence.delete, 'function');
});

test('Persistence: `get`, `set` and `delete` works as intendend', (context) => {
  const key = 'storage.name';
  const valueA = 10000,
        valueB = 20000;

  storage._state[key] = `{ "value": ${valueA} }`;

  const persistence: Persistence<number> = createPersistence(key, { storage });

  context.is(persistence.get(), valueA);

  persistence.set(valueB);

  context.is(persistence.get(), valueB);

  const state = JSON.parse(storage._state[key]);

  context.is(state.value, valueB);

  persistence.delete();

  context.is(storage._state[key], undefined);
});

test('Persistence: You can define a timeout to storage\'s value', async (context) => {
  const time = 1000;
  const persistence: Persistence<{ name: string; }> = createPersistence('user', {
    storage,
    timeout: time // Timeouts storage's value in 1 second.
  });

  persistence.set({ name: 'Vitor' });
  context.deepEqual(persistence.get(), { name: 'Vitor' });

  await new Promise((resolve) => setTimeout(resolve, time));

  context.is(persistence.get(), undefined);
});

test('Persistence: You can define a placeholder to storage\'s value', (context) => {
  const persistence: Persistence<boolean> = createPersistence('isAllowed', {
    storage,
    placeholder: false
  });

  context.false(persistence.get());

  persistence.set(true);

  context.true(persistence.get());

  persistence.delete();

  context.false(persistence.get());
});
