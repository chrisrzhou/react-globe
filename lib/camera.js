import { PerspectiveCamera } from 'three';

import { CAMERA_FAR_RADIUS_SCALE, RADIUS } from './enums';
import { coordinatesToPosition } from './utils';

const CAMERA_FAR = RADIUS * CAMERA_FAR_RADIUS_SCALE;
const CAMERA_FOV = 45;
const CAMERA_NEAR = 1;

export function createCamera(
  initialCoordinates,
  initialCameraDistanceRadiusScale,
) {
  const camera = new PerspectiveCamera();

  camera.name = 'camera';
  camera.far = CAMERA_FAR;
  camera.fov = CAMERA_FOV;
  camera.near = CAMERA_NEAR;

  const [x, y, z] = coordinatesToPosition(
    initialCoordinates,
    RADIUS * initialCameraDistanceRadiusScale,
  );
  camera.position.set(x, y, z);

  return camera;
}
