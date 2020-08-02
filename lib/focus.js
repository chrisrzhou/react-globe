import { RADIUS } from './enums';
import { coordinatesToPosition, tween } from './utils';

export function updateFocus(
  focus,
  camera,
  { options, previousFocus, shouldUnlockAfterFocus, lock, unlock, saveFocus },
) {
  const {
    cameraDistanceRadiusScale,
    focusAnimationDuration,
    focusDistanceRadiusScale,
    focusEasingFunction,
  } = options;

  if (focus) {
    const from = [camera.position.x, camera.position.y, camera.position.z];
    const to = coordinatesToPosition(focus, RADIUS * focusDistanceRadiusScale);
    saveFocus(focus);

    lock();
    tween({
      from,
      to,
      animationDuration: focusAnimationDuration,
      easingFunction: focusEasingFunction,
      onUpdate: () => {
        const [x, y, z] = from;
        camera.position.set(x, y, z);
      },
      onEnd: () => {
        if (shouldUnlockAfterFocus) {
          unlock();
        }
      },
    });
  } else if (previousFocus) {
    const from = [camera.position.x, camera.position.y, camera.position.z];
    const to = coordinatesToPosition(
      previousFocus,
      RADIUS * cameraDistanceRadiusScale,
    );

    lock();
    tween({
      from,
      to,
      animationDuration: focusAnimationDuration,
      easingFunction: focusEasingFunction,
      onUpdate: () => {
        const [x, y, z] = from;
        camera.position.set(x, y, z);
      },
      onEnd: () => {
        saveFocus(null);
        unlock();
      },
    });
  }
}
