import { Any, Coordinates, EasingFunction, Marker, Position } from './types';
export declare function coordinatesToPosition(
  coordinates: Coordinates,
  radius: number,
): Position;
export declare function getMarkerCoordinatesKey(marker: Marker): string;
export declare function maxValue<T>(
  array: T[],
  callback: (item: T) => number,
): number;
export declare function minValue<T>(
  array: T[],
  callback: (item: T) => number,
): number;
export declare function tween(
  from: Any,
  to: Any,
  animationDuration: number,
  easingFunction: EasingFunction,
  onUpdate: () => void,
  onEnd?: () => void,
): void;
