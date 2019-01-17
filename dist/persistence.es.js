function createPersistence(name, options) {
  if ( options === void 0 ) options = {};

  var storage = options.storage; if ( storage === void 0 ) storage = window.localStorage;
  var timeout = options.timeout;
  var placeholder = options.placeholder;
  return {
    set: function set(value) {
      var state = JSON.stringify({
        value: value,
        updatedAt: Date.now()
      });
      storage.setItem(name, state);
    },

    get: function get() {
      var state = storage.getItem(name);
      if (state === null) { return placeholder; }
      var ref = JSON.parse(state);
      var updatedAt = ref.updatedAt;
      var value = ref.value;
      var isExpired = timeout && Date.now() > updatedAt + timeout;
      return isExpired ? placeholder : value;
    },

    delete: function delete$1() {
      storage.removeItem(name);
    }

  };
}

export default createPersistence;
