import { useLayoutEffect, useMemo, useRef } from 'react';

// TODO: temporary solution to https://github.com/facebook/react/issues/14099
// @ts-ignore
export default function useEventCallback(fn): any {
  let ref = useRef();
  useLayoutEffect(
    (): void => {
      ref.current = fn;
    },
  );
  // @ts-ignore
  return useMemo((): void => (...args): void => (0, ref.current)(...args), []);
}
