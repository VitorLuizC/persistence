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

test('Persistence: Uses key as namespace to storage value', (context) => {
  const key = 'value';

  const persistence: Persistence<number> = createPersistence(key, { storage });

  persistence.set(12);

  context.is(typeof storage._state[key], 'string');

  const state = JSON.parse(storage._state[key]);

  context.is(state.value, 12);

  persistence.delete();

  context.is(storage._state[key], undefined);
});

test('Persistence: get() returns value from storage', (context) => {
  const key = 'value';

  storage._state[key] = `{ "value": 10000 }`;

  const persistence: Persistence<number> = createPersistence(key, { storage });

  context.is(persistence.get(), 10000);

  persistence.set(20000);

  context.is(persistence.get(), 20000);
});

test('Persistence: set() saves value to storage', (context) => {
  const key = 'value';

  const persistence: Persistence<number> = createPersistence(key, { storage });

  persistence.set(12);

  context.is(persistence.get(), 12);

  persistence.set(50); // Overwrites value.

  context.is(persistence.get(), 50);
});
