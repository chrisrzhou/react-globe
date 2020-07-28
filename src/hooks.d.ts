import { Size } from './types';

export function useResize(
  mountRef: React.RefObject<HTMLDivElement>,
  initialSize?: Size,
): Size;
