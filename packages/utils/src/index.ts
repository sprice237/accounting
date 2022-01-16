export type PartialRequired<T, K extends keyof T> = {
  [P in keyof Omit<T, K>]: T[P];
} &
  {
    [P in keyof Pick<T, K>]-?: Required<T[P]>;
  };

export const assert = <T extends unknown>(x: T | null | undefined): asserts x is T => {
  if (!x) {
    throw new Error('Assertion failed');
  }
};
