// @ts-ignore: no types for images
import * as backgroundTexture from './textures/background.png';
// @ts-ignore: no types for images
import * as cloudsTexture from './textures/clouds.png';
// @ts-ignore: no types for images
import * as globeTexture from './textures/globe.jpg';
import {
  CameraOptions,
  EasingFunction,
  FocusOptions,
  GlobeOptions,
  LightsOptions,
  Marker,
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
export const CAMERA_MIN_DISTANCE_RADIUS_SCALE = 1.1;
export const CLOUDS_RADIUS_OFFSET = 1;
export const GLOBE_SEGMENTS = 50;
export const MARKER_ANIMATION_DURATION = 2000;
export const MARKER_DEFAULT_COLOR = '#d1d1d1';
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
  maxPolarAngle: Math.PI,
  minPolarAngle: 0,
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
  backgroundTexture,
  cloudsSpeed: 0.5,
  cloudsOpacity: 0.3,
  cloudsTexture,
  enableBackground: true,
  enableClouds: true,
  enableGlow: true,
  glowCoefficient: 0.1,
  glowColor: '#d1d1d1',
  glowPower: 3,
  glowRadiusScale: 0.2,
  texture: globeTexture,
};

export const defaultLightOptions: LightsOptions = {
  ambientLightColor: 'white',
  ambientLightIntensity: 1,
  pointLightColor: 'white',
  pointLightIntensity: 1.5,
  pointLightPositionRadiusScales: [-2, 1, -1],
};

export const defaultDotMarkerOptions: MarkerOptions = {
  activeScale: 2,
  enableTooltip: true,
  getTooltipContent: (marker: Marker) => JSON.stringify(marker.coordinates),
  glowCoefficient: 0,
  glowPower: 4,
  glowRadiusScale: 3,
  radiusScaleRange: [0.005, 0.01],
  type: MarkerType.Dot,
};

export const defaultBarMarkerOptions: MarkerOptions = {
  activeScale: 1.1,
  enableTooltip: true,
  getTooltipContent: (marker: Marker) => JSON.stringify(marker.coordinates),
  glowCoefficient: 0,
  glowPower: 4,
  glowRadiusScale: 0,
  radiusScaleRange: [0.2, defaultFocusOptions.distanceRadiusScale - 1],
  type: MarkerType.Bar,
};

export const defaultMarkerOptions: MarkerOptions = defaultDotMarkerOptions;
