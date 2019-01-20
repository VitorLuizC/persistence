import createPersistence, { Persistence } from '../';
import test from 'ava';

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
  }
}

test('API: module default exports a function', (context) => {
  context.is(typeof createPersistence, 'function');
});

test('API: animate returns Animation', (context) => {
  const persistence: Persistence<number> = createPersistence('name', {
    storage: storage
  });

  context.truthy(persistence);
  context.is(typeof persistence, 'object');
  context.is(typeof persistence.get, 'function');
  context.is(typeof persistence.set, 'function');
  context.is(typeof persistence.delete, 'function');
});
