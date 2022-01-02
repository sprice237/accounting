export type PartialRequired<T, K extends keyof T> = {
  [P in keyof Omit<T, K>]: T[P];
} &
  {
    [P in keyof Pick<T, K>]-?: Required<T[P]>;
  };
