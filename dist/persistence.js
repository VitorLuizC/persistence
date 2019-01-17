export default function createPersistence(name, options = {}) {
    const { storage = window.localStorage, timeout, placeholder, } = options;
    return {
        set(value) {
            const state = JSON.stringify({
                value,
                updatedAt: Date.now()
            });
            storage.setItem(name, state);
        },
        get() {
            const state = storage.getItem(name);
            if (state === null)
                return placeholder;
            const { updatedAt, value } = JSON.parse(state);
            const isExpired = timeout && Date.now() > (updatedAt + timeout);
            return isExpired ? placeholder : value;
        },
        delete() {
            storage.removeItem(name);
        }
    };
}
