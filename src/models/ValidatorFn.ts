export type ValidatorFn<T = any, V = any> = (value: V, allValues: T) => string | undefined;
