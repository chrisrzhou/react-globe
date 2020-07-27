/// <reference types="react" />
import { Size } from './types';
export default function useResize<T>(
  mountRef: React.RefObject<HTMLDivElement>,
  initialSize?: Size,
): Size;
