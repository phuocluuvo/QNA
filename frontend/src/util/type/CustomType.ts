type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/**
 * Make some properties of T optional
 * @example
 * interface User = { name: string; age: number; visible: boolean };
 * type UserType = PartialBy<User, "visible">;//this will make the 'visible' property optional
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
