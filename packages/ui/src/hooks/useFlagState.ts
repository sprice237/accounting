import { useCallback, useState } from 'react';

export const useFlagState = (initialValue = false): [boolean, () => void, () => void] => {
  const [state, setState] = useState(initialValue);

  const setTrue = useCallback(() => setState(true), []);
  const setFalse = useCallback(() => setState(false), []);

  return [state, setTrue, setFalse];
};
