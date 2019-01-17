interface PersistenceOptions {
    storage?: Storage;
    timeout?: number;
    placeholder?: any;
}
export default function createPersistence(name: string, options?: PersistenceOptions): {
    set(value: any): void;
    get(): any;
    delete(): void;
};
export {};
