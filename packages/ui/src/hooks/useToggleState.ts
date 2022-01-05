import { useCallback, useState } from 'react';

export const useToggleState = (initialValue = false): [boolean, () => void] => {
  const [state, setState] = useState(initialValue);

  const toggle = useCallback(() => setState((_value) => !_value), []);

  return [state, toggle];
};
