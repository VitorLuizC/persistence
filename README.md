# `@vitorluizc/persistence`

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

## License

Released under [MIT License](./LICENSE).
