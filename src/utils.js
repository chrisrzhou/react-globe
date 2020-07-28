import * as TWEEN from 'es6-tween';

export function coordinatesToPosition(coordinates, radius) {
  const [lat, long] = coordinates;
  const phi = (lat * Math.PI) / 180;
  const theta = ((long - 180) * Math.PI) / 180;

  const x = -radius * Math.cos(phi) * Math.cos(theta);
  const y = radius * Math.sin(phi);
  const z = radius * Math.cos(phi) * Math.sin(theta);
  return [x, y, z];
}

export function getMarkerCoordinatesKey(marker) {
  return marker.coordinates.toString();
}

export function maxValue(array, callback) {
  let maxValue = 0;
  array.forEach(item => {
    if (callback(item) > maxValue) {
      maxValue = callback(item);
    }
  });
  return maxValue;
}

export function minValue(array, callback) {
  let minValue = Infinity;
  array.forEach(item => {
    if (callback(item) < minValue) {
      minValue = callback(item);
    }
  });
  return minValue;
}

export function tween({
  from,
  to,
  animationDuration,
  easingFunction,
  onUpdate,
  onEnd,
}) {
  new TWEEN.Tween(from)
    .to(to, animationDuration)
    .easing(TWEEN.Easing[easingFunction[0]][easingFunction[1]])
    .on('update', onUpdate)
    .on('complete', onEnd)
    .start();
}
