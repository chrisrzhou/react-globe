import * as TWEEN from 'es6-tween';
import ResizeObserver from 'resize-observer-polyfill';

export function coordinatesToPosition(coordinates, radius) {
  const [lat, long] = coordinates;
  const phi = (lat * Math.PI) / 180;
  const theta = ((long - 180) * Math.PI) / 180;

  const x = -radius * Math.cos(phi) * Math.cos(theta);
  const y = radius * Math.sin(phi);
  const z = radius * Math.cos(phi) * Math.sin(theta);

  return [x, y, z];
}

export function resize(element, callback) {
  const resizeObserver = new ResizeObserver(entries => {
    if (!entries || entries.length === 0) {
      return;
    }
    const { height, width } = entries[0].contentRect;
    callback({ height, width });
  });

  resizeObserver.observe(element);

  return () => {
    resizeObserver.unobserve(element);
  };
}

export function tween({
  from,
  to,
  animationDuration,
  easingFunction,
  onUpdate,
  onEnd = null,
}) {
  new TWEEN.Tween(from)
    .to(to, animationDuration)
    .easing(TWEEN.Easing[easingFunction[0]][easingFunction[1]])
    .on('update', onUpdate)
    .on('complete', onEnd)
    .start();
}
