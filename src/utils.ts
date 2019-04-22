import * as TWEEN from 'es6-tween';

import { Coordinates, EasingFunction, Position } from './types';

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

export function tween(
  from: any,
  to: any,
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
