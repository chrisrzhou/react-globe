import { PerspectiveCamera } from 'three';

import { RADIUS } from './enums';
import { coordinatesToPosition } from './utils';

const CAMERA_FAR = RADIUS * 100;
const CAMERA_FOV = 45;
const CAMERA_NEAR = 1;

export function createCamera(coordinates) {
  const camera = new PerspectiveCamera();

  const [x, y, z] = coordinatesToPosition(coordinates, RADIUS * 3);
  camera.position.set(x, y, z);
  camera.far = CAMERA_FAR;
  camera.fov = CAMERA_FOV;
  camera.near = CAMERA_NEAR;

  return camera;
}
