import 'zustand';

declare module 'zustand' {
  interface StoreApi<T> {
    getState: () => T;
    setState: (partial: Partial<T>, replace?: boolean) => void;
    subscribe: (listener: (state: T, prevState: T) => void) => () => void;
    destroy: () => void;
  }
}
