import {
  CameraOptions,
  EasingFunction,
  FocusOptions,
  GlobeOptions,
  LightOptions,
  MarkerOptions,
  MarkerType,
} from './types';

// hardcoded constants that can eventually be exposed via options
export const RADIUS = 300;
export const BACKGROUND_RADIUS_SCALE = 10;
export const CAMERA_FAR = RADIUS * 100;
export const CAMERA_FOV = 45;
export const CAMERA_NEAR = 1;
export const CAMERA_DAMPING_FACTOR = 0.1;
export const CAMERA_MAX_POLAR_ANGLE = Math.PI;
export const CAMERA_MIN_POLAR_ANGLE = 0;
export const CAMERA_MIN_DISTANCE_RADIUS_SCALE = 1.1;
export const CLOUDS_RADIUS_OFFSET = 1;
export const GLOBE_SEGMENTS = 50;
export const MARKER_DEFAULT_COLOR = 'gold';
export const MARKER_SEGMENTS = 10;
export const MARKER_UNIT_RADIUS_SCALE = 0.01;
export const MARKER_ACTIVE_ANIMATION_DURATION = 100;
export const MARKER_ACTIVE_ANIMATION_EASING_FUNCTION: EasingFunction = [
  'Cubic',
  'In',
];

export const defaultCameraOptions: CameraOptions = {
  autoRotateSpeed: 0.02,
  distanceRadiusScale: 3,
  enableAutoRotate: true,
  enableRotate: true,
  enableZoom: true,
  maxDistanceRadiusScale: 4,
  maxPolarAngle: CAMERA_MAX_POLAR_ANGLE,
  minPolarAngle: CAMERA_MIN_POLAR_ANGLE,
  rotateSpeed: 0.02,
  zoomSpeed: 1,
};

export const defaultFocusOptions: FocusOptions = {
  animationDuration: 1000,
  distanceRadiusScale: 1.5,
  easingFunction: ['Cubic', 'Out'],
  enableDefocus: true,
};

export const defaultGlobeOptions: GlobeOptions = {
  backgroundTexture:
    'https://raw.githubusercontent.com/chrisrzhou/react-globe/master/textures/background.png',
  cloudsSpeed: 0.5,
  cloudsOpacity: 0.3,
  cloudsTexture:
    'https://raw.githubusercontent.com/chrisrzhou/react-globe/master/textures/clouds.png',
  enableBackground: true,
  enableClouds: true,
  enableGlow: true,
  glowCoefficient: 0.1,
  glowColor: '#d1d1d1',
  glowPower: 3,
  glowRadiusScale: 0.2,
  texture:
    'https://raw.githubusercontent.com/chrisrzhou/react-globe/master/textures/globe.jpg',
};

export const defaultLightOptions: LightOptions = {
  ambientLightColor: 'white',
  ambientLightIntensity: 0.8,
  pointLightColor: 'white',
  pointLightIntensity: 1,
  pointLightPositionRadiusScales: [-2, 1, -1],
};

export const defaultDotMarkerOptions: MarkerOptions = {
  activeScale: 1.3,
  animationDuration: 1000,
  enableGlow: true,
  enableTooltip: true,
  getTooltipContent: marker => JSON.stringify(marker.coordinates),
  glowCoefficient: 0,
  glowPower: 3,
  glowRadiusScale: 2,
  radiusScaleRange: [0.005, 0.02],
  type: MarkerType.Dot,
};

export const defaultBarMarkerOptions: MarkerOptions = {
  activeScale: 1.05,
  animationDuration: 2000,
  enableGlow: false,
  enableTooltip: true,
  getTooltipContent: marker => JSON.stringify(marker.coordinates),
  glowCoefficient: 0,
  glowPower: 3,
  glowRadiusScale: 2,
  offsetRadiusScale: 0,
  radiusScaleRange: [0.2, defaultFocusOptions.distanceRadiusScale - 1],
  type: MarkerType.Bar,
};

export const defaultMarkerOptions: MarkerOptions = defaultDotMarkerOptions;
