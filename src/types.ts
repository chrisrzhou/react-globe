import { Group } from 'three';

// Common
export type Coordinates = [number, number];
export type EasingFunction =  // TweenJS curves: https://sole.github.io/tween.js/examples/03_graphs.html
  | ['Back', 'In']
  | ['Back', 'Out']
  | ['Back', 'InOut']
  | ['Bounce', 'In']
  | ['Bounce', 'Out']
  | ['Bounce', 'InOut']
  | ['Circular', 'In']
  | ['Circular', 'Out']
  | ['Circular', 'InOut']
  | ['Cubic', 'In']
  | ['Cubic', 'Out']
  | ['Cubic', 'InOut']
  | ['Elastic', 'In']
  | ['Elastic', 'Out']
  | ['Elastic', 'InOut']
  | ['Linear', 'None']
  | ['Exponential', 'In']
  | ['Exponential', 'Out']
  | ['Exponential', 'InOut']
  | ['Quadratic', 'In']
  | ['Quadratic', 'Out']
  | ['Quadratic', 'InOut']
  | ['Linear', 'None']
  | ['Cubic', 'In']
  | ['Cubic', 'Out']
  | ['Cubic', 'InOut']
  | ['Quartic', 'In']
  | ['Quartic', 'Out']
  | ['Quartic', 'InOut']
  | ['Quintic', 'In']
  | ['Quintic', 'Out']
  | ['Quintic', 'InOut']
  | ['Sinusoidal', 'In']
  | ['Sinusoidal', 'Out']
  | ['Sinusoidal', 'InOut']
  | ['Exponential', 'In']
  | ['Exponential', 'Out']
  | ['Exponential', 'InOut']
  | ['Circular', 'In']
  | ['Circular', 'Out']
  | ['Circular', 'InOut']
  | ['Elastic', 'In']
  | ['Elastic', 'Out']
  | ['Elastic', 'InOut']
  | ['Quadratic', 'In']
  | ['Quadratic', 'Out']
  | ['Quadratic', 'InOut'];
export type Position = [number, number, number];
export type Size = [number, number];

// Options
export interface CameraOptions {
  autoRotateSpeed: number;
  distanceRadiusScale: number;
  enableAutoRotate: boolean;
  enableRotate: boolean;
  enableZoom: boolean;
  maxDistanceRadiusScale: number;
  maxPolarAngle: number;
  minPolarAngle: number;
  rotateSpeed: number;
}

export interface FocusOptions {
  animationDuration: number;
  distanceRadiusScale: number;
  easingFunction: EasingFunction;
  enableDefocus: boolean;
}

export interface GlobeOptions {
  backgroundTexture: string;
  cloudsOpacity: number;
  cloudsSpeed: number;
  cloudsTexture: string;
  enableBackground: boolean;
  enableClouds: boolean;
  enableGlow: boolean;
  glowCoefficient: number;
  glowColor: string;
  glowPower: number;
  glowRadiusScale: number;
  radius: number;
  texture: string;
}

export interface LightsOptions {
  ambientLightColor: string;
  ambientLightIntensity: number;
  pointLightColor: string;
  pointLightIntensity: number;
  pointLightPositionRadiusScales: Position;
}

export interface MarkersOptions {
  enableGlow: boolean;
  glowCoefficient: number;
  glowPower: number;
  glowRadiusScale: number;
  radiusScaleRange: [number, number];
  renderer?: (marker: Marker) => THREE.Group;
  type: MarkersType;
}

// Markers
export enum MarkersType {
  Bar = 'bar',
  Dot = 'dot',
}

export interface Marker {
  coordinates: Coordinates;
  value: number;
  [key: string]: any;
}
