import { useLayoutEffect, useMemo, useRef } from 'react';

// TODO: temporary solution to https://github.com/facebook/react/issues/14099
// @ts-ignore
export default function useEventCallback(fn): any {
  let ref = useRef();
  useLayoutEffect(() => {
    ref.current = fn;
  });
  // @ts-ignore
  return useMemo(() => (...args) => (0, ref.current)(...args), []);
}
