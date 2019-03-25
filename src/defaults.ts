import * as backgroundTexture from './textures/background.png';
import * as cloudsTexture from './textures/clouds.png';
import * as globeTexture from './textures/globe.jpg';
import {
  CameraOptions,
  FocusOptions,
  GlobeOptions,
  LightsOptions,
  MarkersOptions,
  MarkersType,
} from './types';

export const defaultCameraOptions: CameraOptions = {
  autoRotateSpeed: 0.05,
  distanceRadiusScale: 3,
  enableAutoRotate: true,
  enableRotate: true,
  enableZoom: true,
  maxDistanceRadiusScale: 4,
  maxPolarAngle: Math.PI,
  minPolarAngle: 0,
  rotateSpeed: 0.05,
};

export const defaultFocusOptions: FocusOptions = {
  animationDuration: 1000,
  distanceRadiusScale: 1.5,
  easingFunction: ['Cubic', 'Out'],
  enableDefocus: true,
};

export const defaultGlobeOptions: GlobeOptions = {
  backgroundTexture,
  cloudsSpeed: 1,
  cloudsOpacity: 0.3,
  cloudsTexture,
  enableBackground: true,
  enableClouds: true,
  enableGlow: true,
  glowCoefficient: 0.1,
  glowColor: 'gold',
  glowPower: 3,
  glowRadiusScale: 0.2,
  radius: 300,
  texture: globeTexture,
};

export const defaultLightOptions: LightsOptions = {
  ambientLightColor: 'white',
  ambientLightIntensity: 1,
  pointLightColor: 'white',
  pointLightIntensity: 1.5,
  pointLightPositionRadiusScales: [-2, 1, -1],
};

export const defaultDotMarkerOptions: MarkersOptions = {
  enableGlow: true,
  glowCoefficient: 0,
  glowPower: 4,
  glowRadiusScale: 3,
  radiusScaleRange: [0.005, 0.01],
  type: MarkersType.Dot,
};

export const defaultBarMarkerOptions: MarkersOptions = {
  enableGlow: true,
  glowCoefficient: 0,
  glowPower: 4,
  glowRadiusScale: 0,
  radiusScaleRange: [0.2, defaultFocusOptions.distanceRadiusScale - 1],
  type: MarkersType.Bar,
};

export const defaultMarkersOptions: MarkersOptions = defaultDotMarkerOptions;
