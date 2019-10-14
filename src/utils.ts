import * as TWEEN from 'es6-tween';

import { Any, Coordinates, EasingFunction, Marker, Position } from './types';

export function coordinatesToPosition(
  coordinates: Coordinates,
  radius: number,
): Position {
  const [lat, long] = coordinates;
  const phi = (lat * Math.PI) / 180;
  const theta = ((long - 180) * Math.PI) / 180;

  const x = -radius * Math.cos(phi) * Math.cos(theta);
  const y = radius * Math.sin(phi);
  const z = radius * Math.cos(phi) * Math.sin(theta);
  return [x, y, z];
}

export function getMarkerCoordinatesKey(marker: Marker): string {
  return marker.coordinates.toString();
}

export function maxValue<T>(
  array: Array<T>,
  callback: (item: T) => number,
): number {
  let maxValue = 0;
  array.forEach(item => {
    if (callback(item) > maxValue) {
      maxValue = callback(item);
    }
  });
  return maxValue;
}

export function minValue<T>(
  array: Array<T>,
  callback: (item: T) => number,
): number {
  let minValue = Infinity;
  array.forEach(item => {
    if (callback(item) < minValue) {
      minValue = callback(item);
    }
  });
  return minValue;
}

export function tween(
  from: Any,
  to: Any,
  animationDuration: number,
  easingFunction: EasingFunction,
  onUpdate: () => void,
  onEnd?: () => void,
): void {
  new TWEEN.Tween(from)
    .to(to, animationDuration)
    .easing(TWEEN.Easing[easingFunction[0]][easingFunction[1]])
    .on('update', onUpdate)
    .on('complete', onEnd)
    .start();
}
