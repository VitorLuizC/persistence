# `@vitorluizc/persistence`

Persistence provides a pretty easy API to handle Storage's implementations.

- :zap: Pretty fast and **smaller than 0.3KB** (minified + gzipped ESM);
- :label: Type definitions to TS developers and IDE/Editors autocomplete/intellisense;
- :package: ESM, CommonJS and UMD distributions (CDN uses UMD as default);

## Installation

This library is published in the NPM registry and can be installed using any compatible package manager.

```sh
npm install @vitorluizc/persistence --save

# For Yarn, use the command below.
yarn add @vitorluizc/persistence
```

### Installation from CDN

This module has an UMD bundle available through JSDelivr and Unpkg CDNs.

```html
<script src="https://cdn.jsdelivr.net/npm/@vitorluizc/persistence"></script>

<script>
  // module will be available through `persistence` function.

  var name = persistence('name', { placeholder: 'Unknown' });

  name.get();
  //=> 'Unknown'
</script>
```

## Usage

It exports a factory function to create persistence. A persistence can easily `set`, `get` and `delete` JSON parseable values to any `Storage` implementation (ex. `SessionStorage` and `LocalStorage`).

```ts
import createPersistence from '@vitorluizc/persistence';

const persistence = createPersistence<string>('Name', {
  timeout: 1000 * 60 * 60 * 24, // A day in milliseconds
  storage: window.sessionStorage,
  placeholder: ''
});

// Setups field's value as a persistent state on session.
const field = document.querySelector('input[name="name"]');
field.value = persistence.get();
field.addEventListener('input', () => persistence.set(field.value));
```

## API

- **`createPersistence`**

  The default exported factory function. It receives storage's key and, optionally, **`PersistenceOptions`** as arguments and returns a **`Persistence`**.

  ```js
  import createPersistence from '@vitorluizc/persistence';

  const persistence = createPersistence('Storage\'s key', { placeholder: 'None' });
  ```

  <details>
    <summary>TypeScript type definitions.</summary>

  <br />

  ```ts
  declare const createPersistence: {
    <T = any, U = T> (
      name: string,
      options: PersistenceOptions & {
        placeholder: U;
      }
    ): Persistence<T, U>;

    <T = any, U = T | undefined> (
      name: string,
      options?: PersistenceOptions<U>
    ): Persistence<T, U>;
  };

  export default createPersistence;
  ```
  </details>

- **`PersistenceOptions`**

  Options used as second argument on **`createPersistence`** to set timeout, storage and placeholder value to **`Persistence`**.

  ```ts
  import createPersistence, { PersistenceOptions } from '@vitorluizc/persistence';

  const options: PersistenceOptions<boolean> = {
    timeout: 1000 * 60 * 60, // 1 hour in milliseconds.
    placeholder: false
  };

  const persistence = createPersistence<boolean>('isSignedIn', options);
  ```

  <details>
    <summary>TypeScript type definitions.</summary>

  <br />

  ```ts
  export interface PersistenceOptions <T = any> {
    storage?: IStorage;
    timeout?: number;
    placeholder?: T;
  }
  ```
  </details>

- **`Persistence`**

  An object with a pretty easy API to handle a Storage implementation.

  - **`get`**: Get value from persistent storage.

  - **`set`**: Set a value to a persistent storage.

  - **`delete`**: Delete value from persistent storage.

  ```tsx
  import createPersistence, { Persistence } from '@vitorluizc/persistence';

  // ...

  type SignUpFormState = { nickname: string, };

  const state: Persistence<SignUpFormState> = createPersistence('state@name', {
    timeout: 1000 * 60 * 60 * 24, // A day in milliseconds
    placeholder: {
      nickname: ''
    },
  });


  $nickname.value = state.get().nickname;
  $nickname.on('keydown', (e) => state.set({ nickname: e.target.value }));

  $signUpForm.on('submit', (e) => {
    services.signUp(state.get());

    state.delete();
  });
  ```

  <details>
    <summary>TypeScript type definitions.</summary>

  <br />

  ```ts
  export interface Persistence <T = any, U = (T | undefined)> {
    get (): T | U;
    set (value: T): void;
    delete (): void;
  }
  ```
  </details>

## License

Released under [MIT License](./LICENSE).
