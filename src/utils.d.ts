import { Any, Coordinates, EasingFunction, Marker, Position } from './types';

export function coordinatesToPosition(
  coordinates: Coordinates,
  radius: number,
): Position;

export function getMarkerCoordinatesKey(marker: Marker): string;

export function maxValue<T>(array: T[], callback: (item: T) => number): number;

export function minValue<T>(array: T[], callback: (item: T) => number): number;

interface TweenOptions {
  from: Any;
  to: Any;
  animationDuration: number;
  easingFunction: EasingFunction;
  onUpdate: () => void;
  onEnd?: () => void;
}

export function tween({
  from,
  to,
  animationDuration,
  easingFunction,
  onUpdate,
  onEnd,
}: TweenOptions): void;
