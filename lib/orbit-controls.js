import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { RADIUS } from './enums';

const ORBIT_CONTROLS_DAMPING_FACTOR = 0.1;
const ORBIT_CONTROLS_MIN_DISTANCE_RADIUS_SCALE = 1.1;

export function createOrbitControls(camera, renderer) {
  return new OrbitControls(camera, renderer.domElement);
}

export function updateOrbitControls(orbitControls, options) {
  const {
    cameraAutoRotateSpeed,
    cameraMaxDistanceRadiusScale,
    cameraMaxPolarAngle,
    cameraMinPolarAngle,
    cameraRotateSpeed,
    cameraZoomSpeed,
    enableCameraAutoRotate,
    enableCameraRotate,
    enableCameraZoom,
  } = options;

  orbitControls.autoRotate = enableCameraAutoRotate;
  orbitControls.autoRotateSpeed = cameraAutoRotateSpeed;
  orbitControls.dampingFactor = ORBIT_CONTROLS_DAMPING_FACTOR;
  orbitControls.enableDamping = true;
  orbitControls.enablePan = false;
  orbitControls.enableRotate = enableCameraRotate;
  orbitControls.enableZoom = enableCameraZoom;
  orbitControls.maxDistance = RADIUS * cameraMaxDistanceRadiusScale;
  orbitControls.maxPolarAngle = cameraMaxPolarAngle;
  orbitControls.minDistance = RADIUS * ORBIT_CONTROLS_MIN_DISTANCE_RADIUS_SCALE;
  orbitControls.minPolarAngle = cameraMinPolarAngle;
  orbitControls.rotateSpeed = cameraRotateSpeed;
  orbitControls.zoomSpeed = cameraZoomSpeed;
}
