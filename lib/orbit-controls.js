import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { RADIUS } from './enums';

const ORBIT_CONTROLS_DAMPING_FACTOR = 0.1;
const ORBIT_CONTROLS_MIN_DISTANCE_RADIUS_SCALE = 1.1;

export function createOrbitControls(camera, renderer) {
  return new OrbitControls(camera, renderer.domElement);
}

export function updateOrbitControls(orbitControls, options) {
  const {
    enableOrbitControlsAutoRotate,
    enableOrbitControlsRotate,
    enableOrbitControlsZoom,
    orbitControlsAutoRotateSpeed,
    orbitControlsMaxDistanceRadiusScale,
    orbitControlsMaxPolarAngle,
    orbitControlsMinPolarAngle,
    orbitControlsRotateSpeed,
    orbitControlsZoomSpeed,
  } = options;

  orbitControls.autoRotate = enableOrbitControlsAutoRotate;
  orbitControls.autoRotateSpeed = orbitControlsAutoRotateSpeed;
  orbitControls.dampingFactor = ORBIT_CONTROLS_DAMPING_FACTOR;
  orbitControls.enableDamping = true;
  orbitControls.enablePan = false;
  orbitControls.enableRotate = enableOrbitControlsRotate;
  orbitControls.enableZoom = enableOrbitControlsZoom;
  orbitControls.maxDistance = RADIUS * orbitControlsMaxDistanceRadiusScale;
  orbitControls.maxPolarAngle = orbitControlsMaxPolarAngle;
  orbitControls.minDistance = RADIUS * ORBIT_CONTROLS_MIN_DISTANCE_RADIUS_SCALE;
  orbitControls.minPolarAngle = orbitControlsMinPolarAngle;
  orbitControls.rotateSpeed = orbitControlsRotateSpeed;
  orbitControls.zoomSpeed = orbitControlsZoomSpeed;
}
